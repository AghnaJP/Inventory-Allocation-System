import api from './api';
import {
	PurchaseRequest,
	PurchaseRequestsResponse,
	CreatePurchaseRequestDTO,
	UpdatePurchaseRequestDTO,
} from '../types/purchaseRequest';
import { API_ENDPOINTS } from '../constants';

export const purchaseRequestService = {
	async getAll(params?: {
		page?: number;
		limit?: number;
		search?: string;
	}): Promise<PurchaseRequestsResponse> {
		const response = await api.get(API_ENDPOINTS.PURCHASE_REQUESTS, { params });
		return response.data;
	},

	async getById(id: number): Promise<PurchaseRequest> {
		const response = await api.get(`${API_ENDPOINTS.PURCHASE_REQUESTS}/${id}`);
		return response.data;
	},

	async create(data: CreatePurchaseRequestDTO): Promise<PurchaseRequest> {
		const response = await api.post(API_ENDPOINTS.PURCHASE_REQUESTS, data);
		return response.data;
	},

	async update(
		id: number,
		data: UpdatePurchaseRequestDTO
	): Promise<PurchaseRequest> {
		const response = await api.put(
			`${API_ENDPOINTS.PURCHASE_REQUESTS}/${id}`,
			data
		);
		return response.data;
	},

	async delete(id: number): Promise<void> {
		await api.delete(`${API_ENDPOINTS.PURCHASE_REQUESTS}/${id}`);
	},
};
