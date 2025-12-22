import dotenv from 'dotenv';
dotenv.config();

export const BASE_API_URL = process.env.FOOM_URL!;

export const EXTERNAL_FOOM_PURCHASE_API = {
  POST_REQUEST_PURCHASE: BASE_API_URL + '/request/purchase',
};
