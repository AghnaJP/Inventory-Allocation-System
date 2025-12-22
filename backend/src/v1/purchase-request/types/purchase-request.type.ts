export interface GetAllPurchaseRequestsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PurchaseRequestItemInput {
  product_id: number;
  quantity: number;
}

export interface CreatePurchaseRequestDTO {
  warehouse_id: number;
  vendor?: string | null;
  items?: PurchaseRequestItemInput[];
}

export interface UpdatePurchaseRequestDTO {
  warehouse_id?: number;
  vendor?: string | null;
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  items?: PurchaseRequestItemInput[];
}
