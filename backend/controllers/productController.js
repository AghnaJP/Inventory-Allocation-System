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

      res
        .status(200)
        .set({
          'X-Total-Count': result.pagination.total,
          'X-Page': result.pagination.page,
          'X-Limit': result.pagination.limit,
          'X-Total-Pages': result.pagination.totalPages,
        })
        .json(result.data);
    } catch (error) {
      next(error);
    }
  },
};

export default productController;
