import { NestFactory } from '@nestjs/core';

import { AppModule } from '@src/app.module';
import { HttpExceptionFilter } from '@src/config/filters/http.exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { setSwagger } from '@config/swagger/swagger.config';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
  });

  app.enableCors();

  // 쿠키 설정
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  app.enableShutdownHooks();

  app.setGlobalPrefix('/api');

  app.useGlobalFilters(new HttpExceptionFilter());

  setSwagger(app);

  await app.listen(9999);
}
bootstrap();
