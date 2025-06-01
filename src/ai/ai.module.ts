// src/ai/ai.module.ts
import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ProductsModule } from '../products/products.module'; // AiService needs ProductsService
import { ReviewsModule } from '../reviews/reviews.module'; // AiService needs ReviewsService

@Module({
  imports: [ProductsModule, ReviewsModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
