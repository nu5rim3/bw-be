import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status: number =
      exception?.status || HttpStatus?.INTERNAL_SERVER_ERROR;
    let errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      message: exception?.response.message || 'Internal server error',
    };

    if (exception.$metadata) {
      errorResponse = {
        ...errorResponse,
        statusCode: status,
        message: exception.message,
      };
    } else if (exception instanceof HttpException) {
      errorResponse = Object.assign(errorResponse, exception.getResponse());
    } else if (exception.code) {
      errorResponse = {
        ...errorResponse,
        statusCode: status,
        message: exception.message,
      };
    }

    response.status(status).json(errorResponse);
  }
}
