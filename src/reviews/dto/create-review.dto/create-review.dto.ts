import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'The content of the review',
    example: 'Great product, very durable!',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    example: 'alinejad.mj@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Rating out of 5 stars',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
