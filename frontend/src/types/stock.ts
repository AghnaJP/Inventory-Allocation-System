import { Product } from './product';
import { Warehouse } from './warehouse';

export interface Stock {
	id: number;
	warehouse_id: number;
	product_id: number;
	quantity: number;
	warehouse: Warehouse;
	product: Product;
	createdAt: string;
	updatedAt: string;
}

export interface StocksResponse {
	data: Stock[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}
