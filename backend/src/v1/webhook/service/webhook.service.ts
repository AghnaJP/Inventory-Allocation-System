import { Transaction } from 'sequelize';
import db from '../../../models/index';
import {
  EErrorCode,
  EErrorMessage,
  EErrorMessagePurchase,
  ESuccessMessagePurchase,
  Status,
} from '../../../types/Message';
import { __DEV__ } from '../../..';
import { TWebhook, WebhookPayload, WebhookResponse } from '../types/webhook.type';

const { PurchaseRequest, PurchaseRequestItem, Stock, Product, sequelize } = db;

const webhookService = {
  async receiveStock(data: WebhookPayload): Promise<WebhookResponse> {
    const webhookType: TWebhook = data.status_request || data.type || (data.event_type as string);
    const reference = data.reference;

    if (!reference) {
      throw new Error(EErrorMessage.VALIDATION_REQUEST_DATA_WEBHOOK);
    }

    switch (webhookType as TWebhook) {
      case 'REQUEST_CONFIRM':
        return await this.handleRequestConfirm(reference, data);

      case 'DONE':
        return await this.handleDone(reference, data);

      case 'REQUEST_REJECTED':
        return await this.handleRequestRejected(reference, data);

      default:
        __DEV__ && console.warn(`Unknown webhook type: ${webhookType}`);
        return {
          message: EErrorMessage.WEBHOOK_UNFINISHED_PROCESSING,
          type: webhookType,
          reference,
        };
    }
  },

  async handleRequestConfirm(reference: string, _data: WebhookPayload): Promise<WebhookResponse> {
    const result = await sequelize.transaction(async (t: Transaction) => {
      const purchaseRequest = await PurchaseRequest.findOne({
        where: { reference },
        transaction: t,
      });

      if (!purchaseRequest) {
        throw new Error(`Purchase request with reference ${reference} not found`);
      }

      return {
        message: ESuccessMessagePurchase.PURCHASE_REQUEST_CONFIRMED,
        reference,
        status: purchaseRequest.status,
      };
    });

    return result;
  },

  async handleDone(reference: string, data: WebhookPayload): Promise<WebhookResponse> {
    const details = data.details;

    if (!details || !Array.isArray(details)) {
      throw new Error(EErrorMessage.VALIDATION_REQUEST_DATA_WEBHOOK);
    }

    const result = await sequelize.transaction(async (t: Transaction) => {
      const purchaseRequest = await PurchaseRequest.findOne({
        where: { reference },
        include: [
          {
            model: PurchaseRequestItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
              },
            ],
          },
        ],
        transaction: t,
      });

      if (!purchaseRequest) {
        throw new Error(`Purchase request with reference ${reference} not found`);
      }

      if (purchaseRequest.status === Status.COMPLETED) {
        throw new Error(`Purchase request ${reference} is already completed`);
      }

      for (const item of details) {
        const { sku_barcode, qty } = item;

        const product = await Product.findOne({
          where: { sku: sku_barcode },
          transaction: t,
        });

        if (!product) {
          __DEV__ && console.warn(`Product with SKU ${sku_barcode} not found, skipping...`);
          continue;
        }

        const [stock, created] = await Stock.findOrCreate({
          where: {
            warehouse_id: purchaseRequest.warehouse_id,
            product_id: product.id,
          },
          //@ts-ignore TODO - Validate api contract
          defaults: {
            quantity: qty,
          },
          transaction: t,
        });

        if (!created) {
          await stock.increment('quantity', { by: qty, transaction: t });
        }
      }

      await purchaseRequest.update({ status: Status.COMPLETED }, { transaction: t });

      return {
        message: 'Stock received successfully',
        reference,
        status: Status.COMPLETED,
      };
    });

    return result;
  },

  async handleRequestRejected(reference: string, _data: WebhookPayload): Promise<WebhookResponse> {
    const result = await sequelize.transaction(async (transaction: Transaction) => {
      const purchaseRequest = await PurchaseRequest.findOne({
        where: { reference },
        transaction,
      });

      if (!purchaseRequest) {
        throw new Error(`Purchase request with reference ${reference} not found`);
      }

      await purchaseRequest.update({ status: EErrorCode.REJECTED }, { transaction });

      return {
        message: EErrorMessagePurchase.PURCHASE_REQUEST_REJECTED,
        reference,
        status: EErrorCode.REJECTED,
      };
    });

    return result;
  },
};

export default webhookService;
