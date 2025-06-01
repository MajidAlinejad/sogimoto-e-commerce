// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common'; // Don't forget to import this for global pipes

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- GLOBAL PIPES AND OTHER CONFIGURATIONS GO HERE (BEFORE listen) ---
  // Enable CORS (Cross-Origin Resource Sharing) if your frontend is on a different domain
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3003', // Allow requests from your Next.js frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're sending cookies or authorization headers
  });

  // Apply global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // --- SWAGGER SETUP BLOCK - THIS MUST BE BEFORE app.listen() ---
  const config = new DocumentBuilder()
    .setTitle('Product Review API') // Your API title
    .setDescription('API for managing products, reviews, and AI summaries.') // Your API description
    .setVersion('1.0') // API version
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // This registers the /api route

  // --- START LISTENING FOR REQUESTS ---
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Swagger UI will be available at: ${await app.getUrl()}/api`); // Log before listening

  console.log(`Application is now running on: ${await app.getUrl()}`); // Confirm after listening
}
bootstrap();
