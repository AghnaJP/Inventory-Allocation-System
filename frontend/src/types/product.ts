export interface Product {
	id: number;
	name: string;
	sku: string;
	createdAt: string;
	updatedAt: string;
}

export interface ProductsResponse {
	data: Product[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}
