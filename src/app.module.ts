import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [ProductsModule, ReviewsModule, UsersModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
