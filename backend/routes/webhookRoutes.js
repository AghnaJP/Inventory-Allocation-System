const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// POST /api/webhook/receive-stock - receive stock from supplier
router.post('/receive-stock', webhookController.receiveStock);

module.exports = router;
