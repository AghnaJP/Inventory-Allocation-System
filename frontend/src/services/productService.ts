import api from './api';
import { ProductsResponse } from '../types/product';
import { API_ENDPOINTS } from '../constants';

export const productService = {
	async getAll(params?: {
		page?: number;
		limit?: number;
		search?: string;
	}): Promise<ProductsResponse> {
		const response = await api.get(API_ENDPOINTS.PRODUCTS, { params });
		return response.data;
	},
};
