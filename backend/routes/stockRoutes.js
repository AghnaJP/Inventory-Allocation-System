import express from 'express';
import stockController from '../controllers/stockController.js';

const router = express.Router();

// GET /api/stocks - list all stocks with warehouse and product info
router.get('/', stockController.getAllStocks);

export default router;
