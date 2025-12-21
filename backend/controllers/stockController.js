const stockService = require('../services/stockService');

const stockController = {
	async getAllStocks(req, res, next) {
		try {
			const { page = 1, limit = 10, search = '' } = req.query;

			const result = await stockService.getAllStocks({
				page: parseInt(page),
				limit: parseInt(limit),
				search,
			});

			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	},
};

module.exports = stockController;
