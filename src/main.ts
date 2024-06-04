import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  const config = new DocumentBuilder()
   .setTitle('nodo')
   .setDescription('project for a bot company integrated with watti')
   .setVersion('1.0')
   .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('nodo/docs', app, document);

  await app.listen(process.env.PORT);
  
  const log = new Logger('nodo');
  log.log(`nodo is running on: ${await app.getUrl()}`);
}
bootstrap();
