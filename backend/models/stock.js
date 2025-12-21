'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Stock extends Model {
		static associate(models) {
			Stock.belongsTo(models.Warehouse, {
				foreignKey: 'warehouse_id',
				as: 'warehouse',
			});
			Stock.belongsTo(models.Product, {
				foreignKey: 'product_id',
				as: 'product',
			});
		}
	}
	Stock.init(
		{
			warehouse_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			product_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			modelName: 'Stock',
		}
	);
	return Stock;
};
