// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: CreateProductDto): Promise<Product> {
    return await this.prisma.product.create({ data });
  }

  async findOne(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async seedProducts(): Promise<void> {
    const products = await this.prisma.product.findMany();
    if (products.length === 0) {
      await this.prisma.product.createMany({
        data: [
          {
            name: 'Laptop Pro X',
            description: 'Powerful laptop for professionals.',
            price: 1500.0,
          },
          {
            name: 'Wireless Ergonomic Mouse',
            description: 'Comfortable mouse for long use.',
            price: 45.99,
          },
          {
            name: '4K Monitor 27-inch',
            description: 'Stunning visuals with vibrant colors.',
            price: 399.0,
          },
        ],
      });
      console.log('Seeded initial products.');
    }
  }
}
