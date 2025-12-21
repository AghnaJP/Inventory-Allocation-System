import api from './api';
import { StocksResponse } from '../types/stock';
import { API_ENDPOINTS } from '../constants';

export const stockService = {
	async getAll(params?: {
		page?: number;
		limit?: number;
		search?: string;
	}): Promise<StocksResponse> {
		const response = await api.get(API_ENDPOINTS.STOCKS, { params });
		return response.data;
	},
};
