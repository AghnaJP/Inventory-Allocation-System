import {
  Controller,
  Get,
  Route,
  Tags,
  Query,
  Path,
  Post,
  Put,
  Delete,
  Body,
  SuccessResponse,
  Response,
} from 'tsoa';
import PurchaseRequestService from '../service/purchase-request.service';
import {
  GetAllPurchaseRequestsParams,
  CreatePurchaseRequestDTO,
  UpdatePurchaseRequestDTO,
} from '../types/purchase-request.type';
import { PaginatedResult } from '../../../types/Common';
import {
  EErrorMessage,
  EErrorMessagePurchase,
  ESuccessMessage,
  Status,
} from '../../../types/Message';

type PurchaseRequestItemResponse = {
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    sku: string;
  };
};

type PurchaseRequestResponse = {
  id: number;
  reference: string;
  vendor: string | null;
  status: string;
  items: PurchaseRequestItemResponse[];
};

@Route('/v1/purchase-requests')
@Tags('Purchase Requests')
export class PurchaseRequestController extends Controller {
  /**
   * GET /purchase-requests
   */
  @Get()
  public async getAll(
    @Query() page?: number,
    @Query() limit?: number,
    @Query() search?: string,
  ): Promise<PaginatedResult<PurchaseRequestResponse>> {
    const params: GetAllPurchaseRequestsParams = { page, limit, search };
    return PurchaseRequestService.getAllPurchaseRequests(params);
  }

  /**
   * GET /purchase-requests/{id}
   */
  @Get('{id}')
  public async getById(
    @Path() id: number,
  ): Promise<PurchaseRequestResponse | null | { status: Status; message: string }> {
    try {
      const purchaseRequestResponse = await PurchaseRequestService.getPurchaseRequestById(id);

      if (!purchaseRequestResponse) {
        return {
          status: Status.RESOURCE_NOT_FOUND,
          message: EErrorMessagePurchase.NOT_FOUND_404,
        };
      }
      return purchaseRequestResponse;
    } catch (error) {
      this.setStatus(500);
      return {
        status: Status.ERROR,
        message: EErrorMessage.INTERNAL_SERVER_ERROR,
      };
    }
  }

  /**
   * POST /purchase-requests
   */
  @Post()
  @SuccessResponse('201', 'Created')
  @Response<Error>('500', 'Internal Server Error')
  public async create(
    @Body() dto: CreatePurchaseRequestDTO,
  ): Promise<PurchaseRequestResponse | null | { status: Status; message: string; id?: string }> {
    try {
      this.setStatus(201);
      const response = await PurchaseRequestService.createPurchaseRequest(dto);

      return {
        status: Status.OK,
        message: ESuccessMessage.CREATED_SUCCESSFULLY,
        id: response?.id as unknown as string,
      };
    } catch (error) {
      this.setStatus(500);
      return {
        status: Status.ERROR,
        message: EErrorMessage.INTERNAL_SERVER_ERROR,
      };
    }
  }

  /**
   * PUT /purchase-requests/{id}
   */
  @Put('{id}')
  public async update(
    @Path() id: number,
    @Body() dto: UpdatePurchaseRequestDTO,
  ): Promise<PurchaseRequestResponse | null | { status: Status; message: string }> {
    const response = await PurchaseRequestService.updatePurchaseRequest(id, dto);

    if (!response) {
      return {
        status: Status.RESOURCE_NOT_FOUND,
        message: EErrorMessagePurchase.NOT_FOUND_404,
      };
    }
    return {
      status: Status.OK,
      message: ESuccessMessage.UPDATED_SUCCESSFULLY,
    };
  }

  /**
   * DELETE /purchase-requests/{id}
   */
  @Delete('{id}')
  public async delete(@Path() id: number): Promise<{ status?: Status; message: string }> {
    const deleted = await PurchaseRequestService.deletePurchaseRequest(id);
    if (!deleted) {
      this.setStatus(404);
      return { status: Status.ERROR, message: EErrorMessagePurchase.NOT_FOUND_404 };
    }
    return { status: Status.OK, message: ESuccessMessage.DELETED_SUCCESSFULLY };
  }
}
