const productService = require('../services/productService');

const productController = {
	async getAllProducts(req, res, next) {
		try {
			const { page = 1, limit = 10, search = '' } = req.query;

			const result = await productService.getAllProducts({
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

module.exports = productController;
