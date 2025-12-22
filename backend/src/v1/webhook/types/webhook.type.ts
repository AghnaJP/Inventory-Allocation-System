export type TStatusProgression = 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED';

export interface WebhookDetail {
  sku_barcode: string;
  qty: number;
}

export interface WebhookPayload {
  reference: string;
  status_request?: string;
  type?: string;
  event_type?: string;
  details?: WebhookDetail[];
}

export interface WebhookResponse {
  message: string;
  reference: string;
  status?: TStatusProgression | string;
  type?: string;
}

export type TWebhook = 'REQUEST_CONFIRM' | 'DONE' | 'REQUEST_REJECTED' | string;
