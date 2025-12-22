import { Response as ExResponse, Request as ExRequest, NextFunction } from 'express';
import { ValidateError } from 'tsoa';
import { EErrorCode, EErrorMessage } from '../types/Message';

export type TErrorType = Error | ValidateError;

const errorHandlerMiddleware = (
  err: TErrorType,
  _req: ExRequest,
  res: ExResponse,
  next: NextFunction,
): ExResponse | void => {
  const timestamp = new Date().toISOString();
  const path = _req.originalUrl;
  if (err instanceof ValidateError) {
    return res.status(400).json({
      code: EErrorCode.VALIDATION,
      message: EErrorMessage.VALIDATION_REQUEST_DATA,
      data: err,
      timestamp,
      path,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: err?.message || EErrorCode.GENERIC,
      type: EErrorMessage.INTERNAL_SERVER_ERROR,
      code: EErrorCode.GENERIC,
      timestamp,
      path,
    });
  }

  next();
};

export default errorHandlerMiddleware;
