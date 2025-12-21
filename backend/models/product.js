'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		static associate(models) {
			Product.hasMany(models.Stock, {
				foreignKey: 'product_id',
				as: 'stocks',
			});
			Product.hasMany(models.PurchaseRequestItem, {
				foreignKey: 'product_id',
				as: 'purchaseRequestItems',
			});
		}
	}
	Product.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			sku: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
		},
		{
			sequelize,
			modelName: 'Product',
		}
	);
	return Product;
};
