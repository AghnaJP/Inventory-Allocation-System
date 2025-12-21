import api from './api';
import { Warehouse } from '../types/warehouse';
import { API_ENDPOINTS } from '../constants';

export const warehouseService = {
	async getAll(): Promise<Warehouse[]> {
		const response = await api.get(API_ENDPOINTS.WAREHOUSES);
		return response.data;
	},
};
