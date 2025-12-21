'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Insert Warehouses
		await queryInterface.bulkInsert(
			'Warehouses',
			[
				{
					id: 1,
					name: 'Main Warehouse',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 2,
					name: 'Secondary Warehouse',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 3,
					name: 'Third Warehouse',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);

		// Insert Products
		await queryInterface.bulkInsert(
			'Products',
			[
				{
					id: 1,
					name: 'Icy Mint',
					sku: 'ICYMINT',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 2,
					name: 'Cool Breeze',
					sku: 'COOLBREEZE',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 3,
					name: 'Fresh Lemon',
					sku: 'FRESHLEMON',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 4,
					name: 'Berry Blast',
					sku: 'BERRYBLAST',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 5,
					name: 'Tropical Punch',
					sku: 'TROPICALPUNCH',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);

		// Insert Stocks
		await queryInterface.bulkInsert(
			'Stocks',
			[
				// Main Warehouse stocks
				{
					warehouse_id: 1,
					product_id: 1,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					warehouse_id: 1,
					product_id: 2,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					warehouse_id: 1,
					product_id: 3,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					warehouse_id: 1,
					product_id: 4,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				// Secondary Warehouse stocks
				{
					warehouse_id: 2,
					product_id: 1,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					warehouse_id: 2,
					product_id: 4,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					warehouse_id: 2,
					product_id: 5,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				// Third Warehouse stocks
				{
					warehouse_id: 3,
					product_id: 1,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					warehouse_id: 3,
					product_id: 2,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					warehouse_id: 3,
					product_id: 3,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					warehouse_id: 3,
					product_id: 5,
					quantity: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Stocks', null, {});
		await queryInterface.bulkDelete('Products', null, {});
		await queryInterface.bulkDelete('Warehouses', null, {});
	},
};
