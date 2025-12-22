import api from './api';
import { WarehouseList } from '../types/warehouse';
import { API_ENDPOINTS } from '../constants';

export const warehouseService = {
  async getAll(): Promise<WarehouseList> {
    const response = await api.get(API_ENDPOINTS.WAREHOUSES);
    return response.data;
  },
};
