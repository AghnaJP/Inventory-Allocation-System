import { Controller, Get, Query, Response, Route, SuccessResponse, Tags } from 'tsoa';
import { GetAllProductsParams, ProductService } from '../service/product.service';
import { ProductAttributes } from '../model/Product';
import { PaginatedResult } from '../../../types/Common';

@Route('/v1/products')
@Tags('Product')
export class ProductController extends Controller {
  private service = new ProductService();

  /**
   * Get all products with pagination and optional search
   */
  @Get()
  @SuccessResponse('200', 'OK')
  @Response<Error>('500', 'Internal Server Error')
  public async getAllProducts(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() search?: string,
  ): Promise<PaginatedResult<ProductAttributes>> {
    const params: GetAllProductsParams = { page, limit, search };
    return await this.service.getAllProducts(params);
  }
}
