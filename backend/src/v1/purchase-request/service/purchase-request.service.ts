import db from '../model/index';
import { Op, Transaction } from 'sequelize';
import got, { RequestError } from 'got';
import dotenv from 'dotenv';
dotenv.config();

import {
  GetAllPurchaseRequestsParams,
  CreatePurchaseRequestDTO,
  UpdatePurchaseRequestDTO,
} from '../types/purchase-request.type';

import { ESortOrder, PaginatedResult } from '../../../types/Common';
import { PurchaseRequestItemAttributes } from '../model/PurchaseRequestItem';
import { PurchaseRequest as PurchaseReqType } from '../model/PurchaseRequest';
import { EErrorMessage, EPRstatus } from '../../../types/Message';
import { EXTERNAL_API_TIMEOUT_MS } from '../../../constants/_config';
import { EXTERNAL_FOOM_PURCHASE_API } from '../../../constants/APIURLs';
import { __DEV__ } from '../../..';

const { PurchaseRequest, PurchaseRequestItem, Product, Warehouse, sequelize } = db;

type PurchaseRequestWithRelations = {
  id: number;
  reference: string;
  vendor: string | null;
  status: string;
  items: Array<
    PurchaseRequestItemAttributes & {
      product: {
        id: number;
        name: string;
        sku: string;
      };
    }
  >;
};

export class PurchaseRequestService {
  /**
   * GET ALL
   */
  public async getAllPurchaseRequests(
    params: GetAllPurchaseRequestsParams,
  ): Promise<PaginatedResult<PurchaseRequestWithRelations>> {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = params.search?.trim()
      ? {
          [Op.or]: [
            { reference: { [Op.iLike]: `%${params.search}%` } },
            { vendor: { [Op.iLike]: `%${params.search}%` } },
            { '$warehouse.name$': { [Op.iLike]: `%${params.search}%` } },
          ],
        }
      : undefined;

    const { count, rows: idRows } = await PurchaseRequest.findAndCountAll({
      where: whereClause,
      include: [{ model: Warehouse, as: 'warehouse', attributes: [] }],
      attributes: ['id'],
      limit,
      offset,
      order: [['createdAt', ESortOrder.DESCENDING]],
      distinct: true,
      subQuery: false,
    });

    const ids = idRows.map((row) => row.get('id') as number);

    const rows = await PurchaseRequest.findAll({
      where: { id: ids },
      include: [
        { model: Warehouse, as: 'warehouse', attributes: ['id', 'name'] },
        {
          model: PurchaseRequestItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'sku'],
            },
          ],
        },
      ],
      order: [['createdAt', ESortOrder.DESCENDING]],
    });

    return {
      data: rows as unknown as PurchaseRequestWithRelations[],
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * GET BY ID
   */
  public async getPurchaseRequestById(id: number): Promise<PurchaseRequestWithRelations | null> {
    return PurchaseRequest.findByPk(id, {
      include: [
        { model: Warehouse, as: 'warehouse', attributes: ['id', 'name'] },
        {
          model: PurchaseRequestItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'sku'] }],
        },
      ],
    }) as Promise<PurchaseRequestWithRelations | null>;
  }

  /**
   * CREATE
   */
  public async createPurchaseRequest(
    data: CreatePurchaseRequestDTO,
  ): Promise<PurchaseRequestWithRelations | null> {
    return sequelize.transaction(async (t: Transaction) => {
      const reference = `PR${Date.now().toString().slice(-5)}`;

      const pr = (await PurchaseRequest.create(
        {
          reference,
          warehouse_id: data.warehouse_id,
          status: EPRstatus.DRAFT,
          vendor: data.vendor ?? null,
        },
        { transaction: t },
      )) as PurchaseReqType;

      if (data.items?.length) {
        await PurchaseRequestItem.bulkCreate(
          data.items.map((item) => ({
            purchase_request_id: pr.id,
            product_id: item.product_id,
            quantity: item.quantity,
          })),
          { transaction: t },
        );
      }

      return this.getPurchaseRequestById(pr.id);
    });
  }

  /**
   * UPDATE
   */
  public async updatePurchaseRequest(
    id: number,
    data: UpdatePurchaseRequestDTO,
  ): Promise<PurchaseRequestWithRelations | null> {
    return sequelize.transaction(async (t: Transaction) => {
      const pr = (await PurchaseRequest.findByPk(id, {
        transaction: t,
      })) as PurchaseReqType;

      if (!pr) return null;

      if (pr.status !== EPRstatus.DRAFT) {
        throw new Error(EErrorMessage.ENABLED_UPDATE_DRAFT_STATUS_ONLY);
      }

      const oldStatus = pr.status;

      await pr.update(
        {
          warehouse_id: data.warehouse_id ?? pr.warehouse_id,
          vendor: data.vendor ?? pr.vendor,
          status: data.status ?? pr.status,
        },
        { transaction: t },
      );

      if (data.items) {
        await PurchaseRequestItem.destroy({
          where: { purchase_request_id: id },
          transaction: t,
        });

        await PurchaseRequestItem.bulkCreate(
          data.items.map((item) => ({
            purchase_request_id: id,
            product_id: item.product_id,
            quantity: item.quantity,
          })),
          { transaction: t },
        );
      }

      const updated = await this.getPurchaseRequestById(id);

      if (updated && data.status === EPRstatus.PENDING && oldStatus === EPRstatus.DRAFT) {
        setImmediate(async () => {
          try {
            await this.triggerFoomWebhook(updated);
          } catch (error) {
            const err = error as RequestError;
            /**
             * TODO - uncleared requirement whether it should fail all if external fails
             * Solution : decoupled service to event bus and retry with headless worker to pickup with additional `status` payload
             */
            __DEV__ && console.error('FOOM webhook failed:', err.response?.body || err.message);
          }
        });
      }

      return updated;
    });
  }

  /**
   * DELETE
   */
  public async deletePurchaseRequest(id: number): Promise<boolean | null> {
    const pr = (await PurchaseRequest.findByPk(id)) as PurchaseReqType;
    if (!pr) return null;

    if (pr.status !== EPRstatus.DRAFT) {
      throw new Error(EErrorMessage.ENABLED_DELETE_DRAFT_STATUS_ONLY);
    }

    await pr.destroy();
    return true;
  }

  /**
   * WEBHOOK
   */
  private async triggerFoomWebhook(
    purchaseRequest: PurchaseRequestWithRelations,
  ): Promise<unknown> {
    const details = purchaseRequest.items.map((item) => ({
      product_name: item.product.name,
      sku_barcode: item.product.sku,
      qty: item.quantity,
    }));

    const qty_total = purchaseRequest.items.reduce((sum, item) => sum + item.quantity, 0);

    const payload = {
      vendor: purchaseRequest.vendor,
      reference: purchaseRequest.reference,
      qty_total,
      details,
    };

    const FOOM_SECRET_KEY = process.env.FOOM_SECRET_KEY;

    if (!FOOM_SECRET_KEY) throw new Error(EErrorMessage.EXTERNAL_SECRET_KEY_IS_NOT_DEFINED);

    try {
      const response = await got.post(EXTERNAL_FOOM_PURCHASE_API.POST_REQUEST_PURCHASE, {
        json: payload,
        headers: {
          'secret-key': FOOM_SECRET_KEY,
        },
        timeout: { request: EXTERNAL_API_TIMEOUT_MS },
        responseType: 'json',
      });

      return response.body;
    } catch (error) {
      const err = error as RequestError;
      /**
       * TODO - uncleared requirement whether it should fail all if external fails
       * Solution : decoupled service to event bus and retry with headless worker
       */
      return err;
    }
  }
}

export default new PurchaseRequestService();
