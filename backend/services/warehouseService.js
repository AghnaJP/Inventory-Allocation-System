import db from '../models/index.js';
const { Warehouse } = db;

const warehouseService = {
  async getAllWarehouses() {
    return await Warehouse.findAll({
      order: [['id', 'ASC']],
    });
  },
};

export default warehouseService;
