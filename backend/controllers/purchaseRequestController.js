const purchaseRequestService = require('../services/purchaseRequestService');

const purchaseRequestController = {
	async getAllPurchaseRequests(req, res, next) {
		try {
			const { page = 1, limit = 10, search = '' } = req.query;

			const result = await purchaseRequestService.getAllPurchaseRequests({
				page: parseInt(page),
				limit: parseInt(limit),
				search,
			});

			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	},

	async getPurchaseRequestById(req, res, next) {
		try {
			const { id } = req.params;
			const result = await purchaseRequestService.getPurchaseRequestById(id);

			if (!result) {
				return res
					.status(404)
					.json({ error: `Purchase request id ${id} not found` });
			}

			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	},

	async createPurchaseRequest(req, res, next) {
		try {
			const result = await purchaseRequestService.createPurchaseRequest(
				req.body
			);
			res.status(201).json(result);
		} catch (error) {
			next(error);
		}
	},

	async updatePurchaseRequest(req, res, next) {
		try {
			const { id } = req.params;
			const result = await purchaseRequestService.updatePurchaseRequest(
				id,
				req.body
			);

			if (!result) {
				return res
					.status(404)
					.json({ error: `Purchase request id ${id} not found` });
			}

			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	},

	async deletePurchaseRequest(req, res, next) {
		try {
			const { id } = req.params;
			const result = await purchaseRequestService.deletePurchaseRequest(id);

			if (!result) {
				return res
					.status(404)
					.json({ error: `Purchase request id ${id} not found` });
			}

			res
				.status(200)
				.json({ message: `Purchase request id ${id} deleted successfully` });
		} catch (error) {
			next(error);
		}
	},
};

module.exports = purchaseRequestController;
