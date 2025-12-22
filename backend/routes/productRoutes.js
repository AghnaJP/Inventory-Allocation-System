import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

// GET /api/products - list all products with pagination & search
router.get('/', productController.getAllProducts);

export default router;
