import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LOGGER } from './config/middleware/logger.middleware';
import { HttpExceptionFilter } from './config/filters/http.exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { setSwagger } from './config/swagger/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();

  app.use(LOGGER);
  app.setGlobalPrefix('/api');

  app.useGlobalFilters(new HttpExceptionFilter());

  setSwagger(app);

  await app.listen(9999);
}
bootstrap();
