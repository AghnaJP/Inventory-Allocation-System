import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import productRoutes from './routes/productRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import purchaseRequestRoutes from './routes/purchaseRequestRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js';

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

export default app;
