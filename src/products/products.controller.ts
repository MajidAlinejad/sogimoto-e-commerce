import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ReviewsService } from '../reviews/reviews.service';
import { ProductDto as Product, ProductDto } from '../products/dto/product.dto';
import { ReviewDto as Review } from '../reviews/dto/review.dto';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto/create-review.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto, description: 'Product data to create' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({
    status: 409,
    description: 'Product with this name already exists',
  })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    const product = await this.productsService.createProduct(createProductDto);
    return product;
  }

  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: Number })
  @ApiResponse({ status: 200, description: 'Product found', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found' })
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

  @ApiOperation({ summary: 'Get all reviews for a specific product' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: Number })
  @ApiResponse({ status: 200, description: 'Reviews found', type: [Review] })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Get(':id/reviews')
  async getProductReviews(@Param('id') id: string): Promise<Review[]> {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new NotFoundException('Invalid product ID format.');
    }

    const productExists = await this.productsService.findOne(productId);
    if (!productExists) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return this.reviewsService.findAllByProductId(productId);
  }

  @ApiOperation({ summary: 'Create a new review for a product' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: Number })
  @ApiBody({ type: CreateReviewDto, description: 'Review data' })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: Review,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Post(':id/reviews')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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
