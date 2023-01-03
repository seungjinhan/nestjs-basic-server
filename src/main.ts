import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { HttpExceptionFilter } from '@src/config/filters/http.exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { setSwagger } from '@src/config/swagger/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();

  app.setGlobalPrefix('/api');

  app.useGlobalFilters(new HttpExceptionFilter());

  setSwagger(app);

  await app.listen(9999);
}
bootstrap();
