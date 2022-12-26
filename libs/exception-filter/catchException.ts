import { LoggerService } from '@app/logger'
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { errorName } from 'libs/errors'
import { ErrCodeException } from 'libs/exception-filter'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const httpStatus =
      exception instanceof ErrCodeException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    const errCode =
      exception instanceof ErrCodeException
        ? exception.getCode()
        : errorName.e1005000
    const errDesc =
      exception instanceof ErrCodeException
        ? exception.getDescription()
        : 'internal server error'
    const errMsg =
      exception instanceof ErrCodeException ? exception.getMessage() : ''

    const responseBody = {
      err_code: errCode,
      err_description: errDesc,
      err_message: errMsg || '',
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    }

    this.logger.error(responseBody)

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
