const {
	PurchaseRequest,
	PurchaseRequestItem,
	Product,
	Warehouse,
} = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../models').sequelize;
const axios = require('axios');
require('dotenv').config();

const purchaseRequestService = {
	async getAllPurchaseRequests({ page, limit, search }) {
		const limitNum = parseInt(limit) || 10;
		const pageNum = parseInt(page) || 1;
		const offset = (pageNum - 1) * limitNum;

		const whereClause = search
			? {
					[Op.or]: [
						{ reference: { [Op.iLike]: `%${search}%` } },
						{ vendor: { [Op.iLike]: `%${search}%` } },
						{ '$warehouse.name$': { [Op.iLike]: `%${search}%` } },
					],
			  }
			: {};

		const { count, rows: idRows } = await PurchaseRequest.findAndCountAll({
			where: whereClause,
			include: [
				{
					model: Warehouse,
					as: 'warehouse',
					attributes: [],
				},
			],
			attributes: ['id'],
			limit: limitNum,
			offset: offset,
			order: [['createdAt', 'DESC']],
			distinct: true,
			subQuery: false,
		});

		const targetIds = idRows.map((r) => r.id);

		const rows = await PurchaseRequest.findAll({
			where: { id: targetIds },
			include: [
				{
					model: Warehouse,
					as: 'warehouse',
					attributes: ['id', 'name'],
				},
				{
					model: PurchaseRequestItem,
					as: 'items',
					include: [
						{
							model: Product,
							as: 'product',
							attributes: ['id', 'name', 'sku'],
						},
					],
				},
			],
			order: [['createdAt', 'DESC']],
		});

		return {
			data: rows,
			pagination: {
				total: count,
				page: pageNum,
				limit: limitNum,
				totalPages: Math.ceil(count / limitNum),
			},
		};
	},

	async getPurchaseRequestById(id) {
		const purchaseRequest = await PurchaseRequest.findByPk(id, {
			include: [
				{
					model: Warehouse,
					as: 'warehouse',
					attributes: ['id', 'name'],
				},
				{
					model: PurchaseRequestItem,
					as: 'items',
					include: [
						{
							model: Product,
							as: 'product',
							attributes: ['id', 'name', 'sku'],
						},
					],
				},
			],
		});

		return purchaseRequest;
	},

	async createPurchaseRequest(data) {
		const { warehouse_id, items, vendor } = data;

		const result = await sequelize.transaction(async (t) => {
			const reference = `PR${Date.now().toString().slice(-5)}`;

			const purchaseRequest = await PurchaseRequest.create(
				{
					reference,
					warehouse_id,
					status: 'DRAFT',
					vendor: vendor || null,
				},
				{ transaction: t }
			);

			if (items && items.length > 0) {
				const itemsData = items.map((item) => ({
					purchase_request_id: purchaseRequest.id,
					product_id: item.product_id,
					quantity: item.quantity,
				}));

				await PurchaseRequestItem.bulkCreate(itemsData, { transaction: t });
			}

			return await PurchaseRequest.findByPk(purchaseRequest.id, {
				include: [
					{ model: Warehouse, as: 'warehouse' },
					{
						model: PurchaseRequestItem,
						as: 'items',
						include: [{ model: Product, as: 'product' }],
					},
				],
				transaction: t,
			});
		});

		return result;
	},

	async updatePurchaseRequest(id, data) {
		const { warehouse_id, items, status, vendor } = data;

		console.log('=== UPDATE PR DEBUG ===');
		console.log('ID:', id);
		console.log('Data:', data);

		const result = await sequelize.transaction(async (t) => {
			const purchaseRequest = await PurchaseRequest.findByPk(id, {
				include: [
					{
						model: PurchaseRequestItem,
						as: 'items',
						include: [
							{
								model: Product,
								as: 'product',
							},
						],
					},
				],
				transaction: t,
			});

			if (!purchaseRequest) {
				console.log('Puchase Request not found');
				return null;
			}

			const oldStatus = purchaseRequest.status;
			console.log('Old status (before update):', oldStatus);
			console.log('New status (from request):', status);

			if (oldStatus !== 'DRAFT') {
				console.log('Cannot update - status is not DRAFT');
				throw new Error('Can only update purchase requests with DRAFT status');
			}

			await purchaseRequest.update(
				{
					warehouse_id: warehouse_id || purchaseRequest.warehouse_id,
					status: status || purchaseRequest.status,
					vendor: vendor || purchaseRequest.vendor,
				},
				{ transaction: t }
			);

			console.log('Updated Purchase Request in database');
			console.log(
				'After update, purchaseRequest.status is now:',
				purchaseRequest.status
			);

			if (items && items.length > 0) {
				await PurchaseRequestItem.destroy({
					where: { purchase_request_id: id },
					transaction: t,
				});

				const itemsData = items.map((item) => ({
					purchase_request_id: id,
					product_id: item.product_id,
					quantity: item.quantity,
				}));

				await PurchaseRequestItem.bulkCreate(itemsData, { transaction: t });
			}

			const updatedPR = await PurchaseRequest.findByPk(id, {
				include: [
					{
						model: Warehouse,
						as: 'warehouse',
					},
					{
						model: PurchaseRequestItem,
						as: 'items',
						include: [
							{
								model: Product,
								as: 'product',
							},
						],
					},
				],
				transaction: t,
			});

			const shouldTrigger = status === 'PENDING' && oldStatus === 'DRAFT';
			console.log('Should trigger webhook?', shouldTrigger);
			console.log('- status === PENDING:', status === 'PENDING');
			console.log('- oldStatus === DRAFT:', oldStatus === 'DRAFT');

			if (shouldTrigger) {
				console.log('Triggering FOOM webhook...');
				setImmediate(async () => {
					try {
						await purchaseRequestService.triggerFoomWebhook(updatedPR);
					} catch (error) {
						console.error('Failed to trigger FOOM webhook:', error.message);
					}
				});
			} else {
				console.log('NOT triggering webhook');
			}

			console.log('UPDATE COMPLETE\n');
			return updatedPR;
		});

		return result;
	},

	async triggerFoomWebhook(purchaseRequest) {
		const details = purchaseRequest.items.map((item) => ({
			product_name: item.product.name,
			sku_barcode: item.product.sku,
			qty: item.quantity,
		}));

		const qty_total = purchaseRequest.items.reduce(
			(sum, item) => sum + item.quantity,
			0
		);

		const payload = {
			vendor: purchaseRequest.vendor || 'PT FOOM LAB GLOBAL',
			reference: purchaseRequest.reference,
			qty_total,
			details,
		};

		const FOOM_URL = process.env.FOOM_URL;
		const FOOM_SECRET_KEY = process.env.FOOM_SECRET_KEY;

		if (!FOOM_URL)
			throw new Error('FOOM_URL is not defined in environment variables');
		if (!FOOM_SECRET_KEY)
			throw new Error(
				'FOOM_SECRET_KEY is not defined in environment variables'
			);

		console.log('Triggering FOOM webhook:', payload);

		try {
			const response = await axios.post(FOOM_URL, payload, {
				headers: {
					'Content-Type': 'application/json',
					'secret-key': FOOM_SECRET_KEY,
				},
				timeout: 10000,
			});

			console.log('FOOM webhook response:', response.data);
			return response.data;
		} catch (error) {
			console.error(
				'FOOM webhook error:',
				error.response?.data || error.message
			);
			throw error;
		}
	},

	async deletePurchaseRequest(id) {
		const purchaseRequest = await PurchaseRequest.findByPk(id);

		if (!purchaseRequest) {
			return null;
		}

		if (purchaseRequest.status !== 'DRAFT') {
			throw new Error('Can only delete purchase requests with DRAFT status');
		}

		await purchaseRequest.destroy();
		return true;
	},
};

module.exports = purchaseRequestService;
