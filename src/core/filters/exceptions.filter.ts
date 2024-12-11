import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import { AppError } from '../enums/app-error.enum';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);
  private readonly httpAdapter: AbstractHttpAdapter;

  constructor(httpAdapter: AbstractHttpAdapter) {
    this.httpAdapter = httpAdapter;
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: status,
      internalCode: this.getExceptionInternalCode(exception),
      timestamp: new Date().toISOString(),
      path: this.httpAdapter.getRequestUrl(context.getRequest()),
      message: this.getExceptionMessage(exception),
    };

    this.logger.warn(
      `Status code: ${status}, Internal code: ${responseBody.internalCode}, Path: ${responseBody.path}, Message: ${responseBody.message}`,
    );
    this.httpAdapter.reply(context.getResponse(), responseBody, status);
  }

  private getExceptionMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string'
        ? response
        : (response as { message?: string }).message || 'An error occurred';
    }
    return (exception as Error).message || 'Internal server error';
  }

  private getExceptionInternalCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return typeof response === 'string'
        ? AppError.UNKNOWN_ERROR
        : (response as { code?: number }).code || AppError.UNKNOWN_ERROR;
    }
    return AppError.UNKNOWN_ERROR;
  }
}
