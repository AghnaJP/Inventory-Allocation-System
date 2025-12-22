import express from 'express';
import webhookController from '../controllers/webhookController.js';

const router = express.Router();

/**
 * @swagger
 * /api/webhook/receive-stock:
 *   post:
 *     summary: Receive stock delivery webhook
 *     description: |
 *       Webhook endpoint for FOOM hub to notify stock delivery.
 *
 *       **Webhook Types:**
 *       - REQUEST_CONFIRM: Supplier confirmed the order (~30 seconds after submission)
 *       - DONE: Stock delivered, updates inventory (~60 seconds after submission)
 *       - REQUEST_REJECTED: Order rejected by supplier
 *
 *       **Idempotency:** Prevents duplicate stock updates. Returns error if PR already COMPLETED.
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WebhookPayload'
 *           examples:
 *             done:
 *               summary: Stock delivery (DONE)
 *               value:
 *                 vendor: "PT FOOM LAB GLOBAL"
 *                 reference: "PR00001"
 *                 qty_total: 150
 *                 details:
 *                   - product_name: "Icy Mint"
 *                     sku_barcode: "ICYMINT"
 *                     qty: 100
 *                   - product_name: "Cool Breeze"
 *                     sku_barcode: "COOLBREEZE"
 *                     qty: 50
 *             confirm:
 *               summary: Order confirmation (REQUEST_CONFIRM)
 *               value:
 *                 vendor: "PT FOOM LAB GLOBAL"
 *                 reference: "PR00002"
 *                 qty_total: 0
 *                 details: []
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stock received successfully
 *                 reference:
 *                   type: string
 *                   example: PR00001
 *                 status:
 *                   type: string
 *                   example: COMPLETED
 *       400:
 *         description: Purchase request already completed (idempotency)
 *       404:
 *         description: Purchase request not found
 */

router.post('/receive-stock', webhookController.receiveStock);

export default router;
