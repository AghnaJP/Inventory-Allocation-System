const webhookService = require('../services/webhookService');

const webhookController = {
	async receiveStock(req, res, next) {
		try {
			const result = await webhookService.receiveStock(req.body);
			res.status(200).json(result);
		} catch (error) {
			if (error.message.includes('not found')) {
				return res.status(404).json({ error: error.message });
			}
			if (error.message.includes('already completed')) {
				return res.status(400).json({ error: error.message });
			}
			next(error);
		}
	},
};

module.exports = webhookController;
