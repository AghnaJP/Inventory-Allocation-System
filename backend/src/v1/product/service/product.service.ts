import db from '../model/index';
import { Op, FindAndCountOptions } from 'sequelize';
import { ProductAttributes } from '../model/Product';
import { PaginatedResult } from '../../../types/Common';

const { Product } = db;

export interface GetAllProductsParams {
  page: number;
  limit: number;
  search?: string;
}

export class ProductService {
  public async getAllProducts(
    params: GetAllProductsParams,
  ): Promise<PaginatedResult<ProductAttributes>> {
    const { page, limit, search } = params;
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { sku: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const options: FindAndCountOptions = {
      where: whereClause,
      limit,
      offset,
      order: [['id', 'ASC']],
    };

    const { count, rows } = await Product.findAndCountAll(options);

    const data = (rows as unknown as ProductAttributes[]).map((row) => ({
      id: row.id,
      name: row.name,
      sku: row.sku,
    }));

    return {
      data,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }
}
