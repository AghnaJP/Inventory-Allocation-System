const { Warehouse } = require('../models');

const warehouseService = {
	async getAllWarehouses() {
		return await Warehouse.findAll({
			order: [['id', 'ASC']],
		});
	},
};

module.exports = warehouseService;
