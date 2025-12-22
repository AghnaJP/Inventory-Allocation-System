import { Controller, Get, Route, Query, Tags, Response, SuccessResponse } from 'tsoa';
import { StockService, GetAllStocksParams, StockWithRelations } from '../service/stock.service';
import { PaginatedResult } from '../../../types/Common';

@Route('/v1/stocks')
@Tags('Stock')
export class StockController extends Controller {
  private service = new StockService();

  /**
   * Get all stocks with optional search and pagination
   */
  @Get()
  @SuccessResponse('200', 'OK')
  @Response<Error>('500', 'Internal Server Error')
  public async getAllStocks(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() search?: string,
  ): Promise<PaginatedResult<StockWithRelations>> {
    const params: GetAllStocksParams = { page, limit, search };
    return await this.service.getAllStocks(params);
  }
}
