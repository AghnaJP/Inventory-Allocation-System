import warehouseService from '../services/warehouseService.js';

const warehouseController = {
  async getAllWarehouses(req, res, next) {
    try {
      const warehouses = await warehouseService.getAllWarehouses();
      res.status(200).json(warehouses);
    } catch (error) {
      next(error);
    }
  },
};

export default warehouseController;
