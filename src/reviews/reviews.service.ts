// src/reviews/reviews.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Review } from '@prisma/client';
import { UsersService } from '../users/users.service'; // To get a user ID
import { CreateReviewDto } from './dto/create-review.dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async findAllByProductId(productId: number): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { productId },
      include: { User: { select: { id: true, email: true } } },
    });
  }

  async create(
    productId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const productExists = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    const user = await this.prisma.user.findUnique({
      where: { email: createReviewDto.email },
    });

    if (!productExists) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    if (!user) {
      throw new NotFoundException(
        `User with Email ${createReviewDto.email} not found.`,
      );
    }

    return this.prisma.review.create({
      data: {
        comment: createReviewDto.comment,
        rating: createReviewDto.rating,
        productId: productId,
        userId: user.id,
      },
    });
  }
}
