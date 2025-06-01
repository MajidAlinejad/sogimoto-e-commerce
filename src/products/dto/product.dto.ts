// src/products/dto/product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Product as PrismaProduct } from '@prisma/client';

export class ProductDto implements PrismaProduct {
  @ApiProperty({ description: 'Unique identifier of the product', example: 1 })
  id: number;

  @ApiProperty({ description: 'Name of the product', example: 'Laptop Pro X' })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Powerful laptop for professionals.',
    required: false,
  })
  description: string | null;

  @ApiProperty({ description: 'Price of the product', example: 1500.0 })
  price: number;

  @ApiProperty({
    description: 'Date and time when the product was created',
    example: '2025-06-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the product was last updated',
    example: '2025-06-01T11:00:00.000Z',
  })
  updatedAt: Date;
}
