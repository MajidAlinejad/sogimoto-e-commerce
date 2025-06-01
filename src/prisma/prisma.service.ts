/* eslint-disable @typescript-eslint/no-misused-promises */
// src/prisma/prisma.service.ts
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // You can pass Prisma Client options here if needed, e.g., logging
    super({
      log: ['query', 'info', 'warn', 'error'], // Good for debugging Prisma queries
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Prisma connected to database.');
  }

  async enableShutdownHooks(app: INestApplication) {
    // Cast 'beforeExit' to any to satisfy TypeScript for older Prisma versions
    (this as any).$on('beforeExit', async () => {
      console.log('Prisma disconnecting from database...');
      await app.close(); // This is the 'await' that justifies the outer 'async' context conceptually
    });

    return Promise.resolve(); // This makes the method explicitly return a Promise
  }
}
