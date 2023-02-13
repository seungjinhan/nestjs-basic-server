import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setSwagger = (app: any) => {
  const config = new DocumentBuilder()
    .setTitle('Service API Server')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('Server')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
