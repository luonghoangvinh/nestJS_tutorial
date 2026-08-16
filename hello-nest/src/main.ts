import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  const PORT = 3000;
  
  const config = new DocumentBuilder()
    .setTitle('Hello Nest API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'access-token',
  )
    .build();
  app.useStaticAssets(join(process.cwd(), 'public'));
  app.useGlobalPipes(
    new ValidationPipe({
        transform: true,
        whitelist: true,
    }),
);
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}

bootstrap();
