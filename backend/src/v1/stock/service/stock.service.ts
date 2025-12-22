import db from '../model/index';
import { Op, FindAndCountOptions } from 'sequelize';
import type { StockAttributes } from '../model/Stock';
import { ProductAttributes } from '../../product/model/Product';
import { WarehouseAttributes } from '../../warehouse/model/Warehouse';
import { PaginatedResult } from '../../../types/Common';

const { Stock, Product, Warehouse } = db;

export interface GetAllStocksParams {
  page: number;
  limit: number;
  search?: string;
}

export interface StockWithRelations extends StockAttributes {
  product: ProductAttributes;
  warehouse: WarehouseAttributes;
}

export class StockService {
  public async getAllStocks(
    params: GetAllStocksParams,
  ): Promise<PaginatedResult<StockWithRelations>> {
    const { page, limit, search } = params;
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { '$product.name$': { [Op.iLike]: `%${search}%` } },
            { '$product.sku$': { [Op.iLike]: `%${search}%` } },
            { '$warehouse.name$': { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const options: FindAndCountOptions = {
      where: whereClause,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku'],
        },
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name'],
        },
      ],
      limit,
      offset,
      order: [['id', 'ASC']],
      distinct: true,
    };

    const { count, rows } = await Stock.findAndCountAll(options);

    const data: StockWithRelations[] = (rows as unknown as StockWithRelations[]).map((row) => ({
      id: row.id,
      warehouse_id: row.warehouse_id,
      product_id: row.product_id,
      quantity: row.quantity,
      product: row.product,
      warehouse: row.warehouse,
    }));

    return {
      data,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
}
