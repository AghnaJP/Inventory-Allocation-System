const { Stock, Product, Warehouse } = require('../models');
const { Op } = require('sequelize');

const stockService = {
	async getAllStocks({ page, limit, search }) {
		const offset = (page - 1) * limit;

		const whereClause = search
			? {
					[Op.or]: [
						{ '$product.name$': { [Op.iLike]: `%${search}%` } },
						{ '$product.sku$': { [Op.iLike]: `%${search}%` } },
						{ '$warehouse.name$': { [Op.iLike]: `%${search}%` } },
					],
			  }
			: {};

		const { count, rows } = await Stock.findAndCountAll({
			where: whereClause,
			include: [
				{
					model: Product,
					as: 'product',
					attributes: ['id', 'name', 'sku'],
				},
				{
					model: Warehouse,
					as: 'warehouse',
					attributes: ['id', 'name'],
				},
			],
			limit,
			offset,
			order: [['id', 'ASC']],
			distinct: true,
		});

		return {
			data: rows,
			pagination: {
				total: count,
				page,
				limit,
				totalPages: Math.ceil(count / limit),
			},
		};
	},
};

module.exports = stockService;
