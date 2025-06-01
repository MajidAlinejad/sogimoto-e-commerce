// src/reviews/dto/review.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Review as PrismaReview } from '@prisma/client'; // Import Prisma's Review type

export class ReviewDto implements PrismaReview {
  @ApiProperty({ description: 'Unique identifier of the review', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Comment of the review',
    example: 'This product exceeded my expectations!',
  })
  comment: string;

  @ApiProperty({
    description: 'Rating out of 5 stars',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @ApiProperty({
    description: 'ID of the product this review belongs to',
    example: 1,
  })
  productId: number;

  @ApiProperty({
    description: 'ID of the user who wrote the review',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Date and time when the review was created',
    example: '2025-06-01T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the review was last updated',
    example: '2025-06-01T10:30:00.000Z',
  })
  updatedAt: Date;

  // You might want to include nested User or Product objects if your API returns them
  // For example:
  // @ApiProperty({ type: UserDto, description: 'The user who wrote the review', required: false })
  // User?: UserDto;
  // @ApiProperty({ type: ProductDto, description: 'The product being reviewed', required: false })
  // Product?: ProductDto;
}
