const express = require('express');
const router = express.Router();
const purchaseRequestController = require('../controllers/purchaseRequestController');

// GET /api/purchase-requests - list all purchase requests
router.get('/', purchaseRequestController.getAllPurchaseRequests);

// GET /api/purchase-requests/:id - get single purchase request
router.get('/:id', purchaseRequestController.getPurchaseRequestById);

// POST /api/purchase-requests - create new purchase request
router.post('/', purchaseRequestController.createPurchaseRequest);

// PUT /api/purchase-requests/:id - update purchase request
router.put('/:id', purchaseRequestController.updatePurchaseRequest);

// DELETE /api/purchase-requests/:id - delete purchase request
router.delete('/:id', purchaseRequestController.deletePurchaseRequest);

module.exports = router;
