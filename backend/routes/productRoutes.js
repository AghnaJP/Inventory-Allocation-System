const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - list all products with pagination & search
router.get('/', productController.getAllProducts);

module.exports = router;
