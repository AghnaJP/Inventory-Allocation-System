const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// GET /api/stocks - list all stocks with warehouse and product info
router.get('/', stockController.getAllStocks);

module.exports = router;
