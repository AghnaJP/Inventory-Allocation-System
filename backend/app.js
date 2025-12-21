require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.json({
		message: 'Inventory Allocation System API',
		status: 'running',
	});
});

const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const purchaseRequestRoutes = require('./routes/purchaseRequestRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');

app.use('/api/products', productRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/purchase-requests', purchaseRequestRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/warehouses', warehouseRoutes);

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).json({
		error: err.message || 'Internal server error',
	});
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

module.exports = app;