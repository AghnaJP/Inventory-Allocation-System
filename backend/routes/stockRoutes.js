import express from 'express';
import stockController from '../controllers/stockController.js';

const router = express.Router();

/**
 * @swagger
 * /api/stocks:
 *   get:
 *     summary: Get all stocks
 *     description: Retrieve stock levels with warehouse and product information
 *     tags: [Stocks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name, SKU, or warehouse name
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Stock'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */

router.get('/', stockController.getAllStocks);

export default router;
