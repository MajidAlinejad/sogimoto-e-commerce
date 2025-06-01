/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AiModule } from './ai/ai.module';
import { PrismaService } from './prisma/prisma.service'; // Ensure this is provided
import { ConfigModule } from '@nestjs/config'; // For environment variables
import { UsersModule } from './users/users.module'; // Import UsersModule
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductsModule,
    ReviewsModule,
    AiModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
