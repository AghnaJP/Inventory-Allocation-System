import { Controller, Get, Route, Tags, Response, SuccessResponse, Query } from 'tsoa';
import warehouseService from '../service/warehouse.service';
import { WarehouseAttributes } from '../model/Warehouse';
import { EErrorCode, Status } from '../../../types/Message';
import { PaginatedResult } from '../../../types/Common';

@Route('/v1/warehouses')
@Tags('Warehouse')
export class WarehouseController extends Controller {
  /**
   * Get all warehouses with pagination and search
   */
  @Get()
  @SuccessResponse('200', 'OK')
  @Response<Error>('500', 'Internal Server Error')
  public async getAllWarehouses(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() search?: string,
  ): Promise<PaginatedResult<WarehouseAttributes> | { status: Status; message: string }> {
    try {
      const warehouses = await warehouseService.getAllWarehouses({ page, limit, search });
      return warehouses;
    } catch (error) {
      this.setStatus(500);
      return {
        status: Status.ERROR,
        message: (error as Error).message,
      };
    }
  }
}
