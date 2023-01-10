import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(code: string, message: string, status: number) {
    super({ code, message }, status);
  }
}
