import express from 'express';
import webhookController from '../controllers/webhookController.js';

const router = express.Router();

// POST /api/webhook/receive-stock - receive stock from supplier
router.post('/receive-stock', webhookController.receiveStock);

export default router;
