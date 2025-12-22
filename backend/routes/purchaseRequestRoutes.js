import express from 'express';
import purchaseRequestController from '../controllers/purchaseRequestController.js';

const router = express.Router();

/**
 * @swagger
 * /api/purchase-requests:
 *   get:
 *     summary: Get all purchase requests
 *     description: Retrieve paginated list of purchase requests
 *     tags: [Purchase Requests]
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
 *                     $ref: '#/components/schemas/PurchaseRequest'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */

router.get('/', purchaseRequestController.getAllPurchaseRequests);

/**
 * @swagger
 * /api/purchase-requests/{id}:
 *   get:
 *     summary: Get purchase request by ID
 *     description: Retrieve a single purchase request with full details
 *     tags: [Purchase Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Purchase request ID
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseRequest'
 *       404:
 *         description: Purchase request not found
 */

router.get('/:id', purchaseRequestController.getPurchaseRequestById);

/**
 * @swagger
 * /api/purchase-requests:
 *   post:
 *     summary: Create a new purchase request
 *     description: Create a purchase request in DRAFT status
 *     tags: [Purchase Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePurchaseRequest'
 *     responses:
 *       201:
 *         description: Purchase request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseRequest'
 *       400:
 *         description: Invalid request data
 */

router.post('/', purchaseRequestController.createPurchaseRequest);

/**
 * @swagger
 * /api/purchase-requests/{id}:
 *   put:
 *     summary: Update a purchase request
 *     description: Update purchase request (only allowed when status is DRAFT). Changing status to PENDING triggers FOOM webhook.
 *     tags: [Purchase Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePurchaseRequest'
 *     responses:
 *       200:
 *         description: Purchase request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseRequest'
 *       400:
 *         description: Cannot update - status is not DRAFT
 *       404:
 *         description: Purchase request not found
 */

router.put('/:id', purchaseRequestController.updatePurchaseRequest);

/**
 * @swagger
 * /api/purchase-requests/{id}:
 *   delete:
 *     summary: Delete a purchase request
 *     description: Delete purchase request (only allowed when status is DRAFT)
 *     tags: [Purchase Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase request deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Purchase request deleted successfully
 *       400:
 *         description: Cannot delete - status is not DRAFT
 *       404:
 *         description: Purchase request not found
 */

router.delete('/:id', purchaseRequestController.deletePurchaseRequest);

export default router;
