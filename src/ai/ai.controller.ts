/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/ai/ai.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AiService } from './ai.service';
import { SummarizeRequestDto } from './dto/summarize-request.dto/summarize-request.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('Ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  // POST /Ai/summary
  @ApiOperation({
    summary: 'Summarize product information or arbitrary text using AI',
    description:
      'Provide either raw text or a product ID to generate a summary. These options are mutually exclusive.',
  })
  @ApiBody({
    type: SummarizeRequestDto,
    description: 'Text or Product ID for summarization',
  })
  @ApiResponse({
    status: 200,
    description: 'Summary generated successfully',
    schema: {
      type: 'object',
      properties: {
        summary: {
          type: 'string',
          example: 'A concise summary of the provided content.',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input (e.g., missing text/productId, or both provided)',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found (if productId is provided)',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to generate summary (AI service error)',
  })
  @Post('summary')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async summarize(
    @Body() summarizeRequest: SummarizeRequestDto,
    @Res() res: Response,
  ) {
    // Ensure at least one of `text` or `productId` is provided
    if (!summarizeRequest.text && !summarizeRequest.productId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:
          'Either "text" or "productId" must be provided in the request body.',
      });
    }
    // Ensure only one is provided to avoid ambiguity
    if (summarizeRequest.text && summarizeRequest.productId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message:
          'Only one of "text" or "productId" can be provided for summarization.',
      });
    }

    try {
      const summary =
        await this.aiService.getGenericOrCombinedSummary(summarizeRequest);
      return res.status(HttpStatus.OK).json({ summary });
    } catch (error) {
      console.error('Error in /Ai/summary endpoint:', error.message);
      // More specific error handling based on type of error from service
      if (error.status === HttpStatus.NOT_FOUND) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to generate summary.' });
    }
  }
}
