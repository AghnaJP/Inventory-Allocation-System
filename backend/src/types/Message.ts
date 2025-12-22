export enum EErrorMessage {
  EXTERNAL_URL_IS_NOT_DEFINED = 'FOOM_URL is not defined',
  EXTERNAL_SECRET_KEY_IS_NOT_DEFINED = 'FOOM_SECRET_KEY is not defined',
  ENABLED_DELETE_DRAFT_STATUS_ONLY = 'Can only delete purchase requests with DRAFT status',
  ENABLED_UPDATE_DRAFT_STATUS_ONLY = 'Can only update purchase requests with DRAFT status',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  VALIDATION_REQUEST_DATA = 'Validation request data',
  VALIDATION_REQUEST_DATA_WEBHOOK = 'Missing or invalid details in webhook payload',
  WEBHOOK_UNFINISHED_PROCESSING = 'Webhook received but not processed',
}

export enum Status {
  OK = 'OK',
  ERROR = 'ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  COMPLETED = 'COMPLETED',
}

export enum EErrorMessagePurchase {
  NOT_FOUND_404 = 'Purchase request not found or cannot delete',
  PURCHASE_REQUEST_REJECTED = 'Purchase request rejected',
}

export enum ESuccessMessagePurchase {
  PURCHASE_REQUEST_CONFIRMED = 'Purchase request confirmed',
}

export enum ESuccessMessage {
  DELETED_SUCCESSFULLY = 'Deleted successfully',
  CREATED_SUCCESSFULLY = 'Created successfully',
  UPDATED_SUCCESSFULLY = 'Updated successfully',
}

export enum EErrorCode {
  VALIDATION = 'VALIDATION',
  EXTERNAL = 'EXTERNAL',
  INTERNAL = 'INTERNAL',
  MISSING_CREDENTIALS = 'MISSING_CREDENTIALS',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE = 'Duplicate resource',
  GENERIC = 'GENERIC',
  REJECTED = 'REJECTED',
}

export enum EPRstatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
}
