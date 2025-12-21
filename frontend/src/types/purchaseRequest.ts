import { Product } from './product';
import { Warehouse } from './warehouse';

export interface PurchaseRequestItem {
	id: number;
	purchase_request_id: number;
	product_id: number;
	quantity: number;
	product: Product;
	createdAt: string;
	updatedAt: string;
}

export interface PurchaseRequest {
	id: number;
	reference: string;
	warehouse_id: number;
	status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED';
	vendor?: string;
	warehouse: Warehouse;
	items: PurchaseRequestItem[];
	createdAt: string;
	updatedAt: string;
}

export interface PurchaseRequestsResponse {
	data: PurchaseRequest[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface CreatePurchaseRequestDTO {
	warehouse_id: number;
	vendor?: string;
	items: {
		product_id: number;
		quantity: number;
	}[];
}

export interface UpdatePurchaseRequestDTO {
	warehouse_id?: number;
	vendor?: string;
	status?: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED';
	items?: {
		product_id: number;
		quantity: number;
	}[];
}
