import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LOGGER } from './config/middleware/logger.middleware';
import { HttpExceptionFilter } from './config/filters/http.exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Service API Server')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('Server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  app.enableShutdownHooks();
  app.use(LOGGER);
  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(9999);
}
bootstrap();
