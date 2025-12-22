import { ESortOrder, PaginatedResult } from '../../../types/Common';
import db from '../model/index';
import { Warehouse as WarehouseModel } from '../model/Warehouse';
import { Op } from 'sequelize';

const { Warehouse } = db;

interface GetAllWarehousesParams {
  page?: number;
  limit?: number;
  search?: string;
}

const warehouseService = {
  /**
   * Get all warehouses with pagination and optional search
   */
  async getAllWarehouses(
    params: GetAllWarehousesParams = {},
  ): Promise<PaginatedResult<WarehouseModel>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const offset = (page - 1) * limit;

    const whereClause = params.search
      ? {
          name: {
            [Op.iLike]: `%${params.search}%`,
          },
        }
      : undefined;

    const total = await Warehouse.count({ where: whereClause });

    const warehouses = (await Warehouse.findAll({
      where: whereClause,
      order: [['id', ESortOrder.ASCENDING]],
      limit,
      offset,
    })) as WarehouseModel[];

    return {
      data: warehouses ?? [],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};

export default warehouseService;
