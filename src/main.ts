import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LOGGER } from '../config/middleware/logger.middleware';
import { HttpExceptionFilter } from '../config/filters/http.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(LOGGER);
  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(9999);
}
bootstrap();
