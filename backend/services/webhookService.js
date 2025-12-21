const {
	PurchaseRequest,
	PurchaseRequestItem,
	Stock,
	Product,
} = require('../models');
const sequelize = require('../models').sequelize;

const webhookService = {
	async receiveStock(data) {
		console.log('Received webhook:', JSON.stringify(data, null, 2));

		const webhookType = data.status_request || data.type || data.event_type;
		const reference = data.reference;

		if (!reference) {
			throw new Error('Missing reference in webhook payload');
		}

		switch (webhookType) {
			case 'REQUEST_CONFIRM':
				return await this.handleRequestConfirm(reference, data);

			case 'DONE':
				return await this.handleDone(reference, data);

			case 'REQUEST_REJECTED':
				return await this.handleRequestRejected(reference, data);

			default:
				console.warn(`Unknown webhook type: ${webhookType}`);
				return {
					message: 'Webhook received but not processed',
					type: webhookType,
				};
		}
	},

	async handleRequestConfirm(reference, _data) {
		const result = await sequelize.transaction(async (t) => {
			const purchaseRequest = await PurchaseRequest.findOne({
				where: { reference },
				transaction: t,
			});

			if (!purchaseRequest) {
				throw new Error(
					`Purchase request with reference ${reference} not found`
				);
			}

			console.log(`Purchase request ${reference} confirmed by supplier`);

			return {
				message: 'Purchase request confirmed',
				reference,
				status: purchaseRequest.status,
			};
		});

		return result;
	},

	async handleDone(reference, data) {
		const details = data.details;

		if (!details || !Array.isArray(details)) {
			throw new Error('Missing or invalid details in webhook payload');
		}

		const result = await sequelize.transaction(async (t) => {
			const purchaseRequest = await PurchaseRequest.findOne({
				where: { reference },
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
				throw new Error(
					`Purchase request with reference ${reference} not found`
				);
			}

			if (purchaseRequest.status === 'COMPLETED') {
				console.warn(
					`Purchase request ${reference} is already completed (idempotency check)`
				);
				throw new Error(`Purchase request ${reference} is already completed`);
			}

			console.log(` Processing DONE webhook for ${reference}`);

			for (const item of details) {
				const { sku_barcode, qty } = item;

				const product = await Product.findOne({
					where: { sku: sku_barcode },
					transaction: t,
				});

				if (!product) {
					console.warn(
						`Product with SKU ${sku_barcode} not found, skipping...`
					);
					continue;
				}

				const [stock, created] = await Stock.findOrCreate({
					where: {
						warehouse_id: purchaseRequest.warehouse_id,
						product_id: product.id,
					},
					defaults: {
						quantity: qty,
					},
					transaction: t,
				});

				if (!created) {
					await stock.increment('quantity', { by: qty, transaction: t });
				}

				console.log(
					`Updated stock for ${product.name} (${sku_barcode}): +${qty}`
				);
			}

			await purchaseRequest.update({ status: 'COMPLETED' }, { transaction: t });

			console.log(`Purchase request ${reference} marked as COMPLETED`);

			return {
				message: 'Stock received successfully',
				reference,
				status: 'COMPLETED',
			};
		});

		return result;
	},

	async handleRequestRejected(reference, _data) {
		const result = await sequelize.transaction(async (t) => {
			const purchaseRequest = await PurchaseRequest.findOne({
				where: { reference },
				transaction: t,
			});

			if (!purchaseRequest) {
				throw new Error(
					`Purchase request with reference ${reference} not found`
				);
			}

			await purchaseRequest.update({ status: 'REJECTED' }, { transaction: t });

			console.log(`Purchase request ${reference} rejected by supplier`);

			return {
				message: 'Purchase request rejected',
				reference,
				status: 'REJECTED',
			};
		});

		return result;
	},
};

module.exports = webhookService;
