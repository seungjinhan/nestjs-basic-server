import {
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { makeResponse } from 'src/libs/utils/api';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const res: any = exception.getResponse();

    response.status(200).json(
      makeResponse(false, {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        code: res.code ? res.code : res,
        description: res.message ? res.message : res,
      }),
    );
  }
}
