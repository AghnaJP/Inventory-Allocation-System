export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  STOCKS: '/stocks',
  WAREHOUSES: '/warehouses',
  PURCHASE_REQUESTS: '/purchase-requests',
  WEBHOOK: '/webhook/receive-stock',
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1';
