import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable graceful shutdown (SIGTERM/SIGINT) for platform redeploys
  app.enableShutdownHooks();

  // CORS — configurable via CORS_ORIGIN (comma-separated), falls back to
  // the production frontend URL
  const corsOrigins = (
    process.env.CORS_ORIGIN ?? 'https://scrap-karo-ai.vercel.app'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('ScrapKaro AI – Research API')
    .setDescription(
      'Backend API for the ScrapKaro AI Research Assistant. Submit a research request and receive curated results.',
    )
    .setVersion('1.0')
    .addTag('Research')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api`);
}

bootstrap();
