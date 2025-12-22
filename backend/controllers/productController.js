import productService from '../services/productService.js';

const productController = {
  async getAllProducts(req, res, next) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;

      const result = await productService.getAllProducts({
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        search,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

export default productController;
