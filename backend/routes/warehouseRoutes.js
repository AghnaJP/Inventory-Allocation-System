const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');

// GET /api/warehouses - list all warehouses
router.get('/', warehouseController.getAllWarehouses);

module.exports = router;
