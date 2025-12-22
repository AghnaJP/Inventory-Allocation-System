import express from 'express';
import warehouseController from '../controllers/warehouseController.js';

const router = express.Router();

// GET /api/warehouses - list all warehouses
router.get('/', warehouseController.getAllWarehouses);

export default router;
