const express = require('express');
const cors = require('cors');
const db = require('./models');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('DB connected via Sequelize Models');
  } catch (err) {
    console.error('DB error:', err);
  }
})();

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Inventory Allocation API is running',
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;