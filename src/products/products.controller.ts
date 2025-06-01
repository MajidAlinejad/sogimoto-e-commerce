// src/products/products.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ReviewsService } from '../reviews/reviews.service';
import { ProductDto as Product } from '../products/dto/product.dto';
import { ReviewDto as Review } from '../reviews/dto/review.dto';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto/create-review.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly reviewsService: ReviewsService,
  ) {}

  // GET /products/:id
  @ApiOperation({ summary: 'Get a product by ID' }) // Description for the operation
  @ApiParam({ name: 'id', description: 'ID of the product', type: Number }) // Document the path parameter
  @ApiResponse({ status: 200, description: 'Product found', type: Product }) // Describe success response
  @ApiResponse({ status: 404, description: 'Product not found' }) // Describe error response
  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<Product> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new NotFoundException('Invalid product ID format.');
    }
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return product;
  }

  // GET /products/:id/reviews
  @ApiOperation({ summary: 'Get all reviews for a specific product' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: Number })
  @ApiResponse({ status: 200, description: 'Reviews found', type: [Review] }) // type: [Review] for array
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Get(':id/reviews')
  async getProductReviews(@Param('id') id: string): Promise<Review[]> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new NotFoundException('Invalid product ID format.');
    }
    // Optional: Check if product exists before fetching reviews
    const productExists = await this.productsService.findOne(productId);
    if (!productExists) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return this.reviewsService.findAllByProductId(productId);
  }

  // POST /products/:id/reviews
  @ApiOperation({ summary: 'Create a new review for a product' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: Number })
  @ApiBody({ type: CreateReviewDto, description: 'Review data' }) // Document the request body DTO
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: Review,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Post(':id/reviews')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Apply validation pipe
  async createProductReview(
    @Param('id') id: string,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new NotFoundException('Invalid product ID format.');
    }
    return this.reviewsService.create(productId, createReviewDto);
  }
}
