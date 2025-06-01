// src/products/dto/create-product.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'New Gadget Pro',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A detailed description of the product',
    example: 'An innovative gadget with advanced features.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string; // Optional because of '?' and @IsOptional()

  @ApiProperty({
    description: 'The price of the product',
    example: 99.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0) // Price cannot be negative
  price: number;
}
