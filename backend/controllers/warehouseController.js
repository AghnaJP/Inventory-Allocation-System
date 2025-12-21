const warehouseService = require('../services/warehouseService');

const warehouseController = {
	async getAllWarehouses(req, res, next) {
		try {
			const warehouses = await warehouseService.getAllWarehouses();
			res.status(200).json(warehouses);
		} catch (error) {
			next(error);
		}
	},
};

module.exports = warehouseController;
