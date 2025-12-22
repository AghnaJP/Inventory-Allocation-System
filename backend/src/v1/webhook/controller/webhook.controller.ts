import { Controller, Post, Body, Route, SuccessResponse, Response, Tags } from 'tsoa';
import webhookService from '../service/webhook.service';
import { WebhookPayload, WebhookResponse } from '../types/webhook.type';
import { EErrorCode, EErrorMessage } from '../../../types/Message';

@Route('/v1/webhook')
@Tags('Webhook')
export class WebhookController extends Controller {
  /**
   * Receive stock webhook from external system.
   */
  @Post('receive-stock')
  @SuccessResponse('200', 'Webhook processed successfully')
  @Response<{ message: string }>(400, 'Invalid webhook payload')
  public async receiveStock(@Body() data: WebhookPayload): Promise<WebhookResponse> {
    try {
      const result = await webhookService.receiveStock(data);
      return result;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : EErrorMessage.WEBHOOK_UNFINISHED_PROCESSING;

      return {
        message,
        type:
          data?.status_request || data?.type || (data?.event_type as string) || EErrorCode.GENERIC,
        reference: data?.reference || EErrorCode.GENERIC,
      };
    }
  }
}
