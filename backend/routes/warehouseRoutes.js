import express from 'express';
import warehouseController from '../controllers/warehouseController.js';

const router = express.Router();

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     summary: Get all warehouses
 *     description: Retrieve a list of all warehouses
 *     tags: [Warehouses]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Warehouse'
 */

router.get('/', warehouseController.getAllWarehouses);

export default router;
