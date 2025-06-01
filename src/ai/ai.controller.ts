// src/ai/ai.controller.ts
import { Controller, Body, Res, HttpStatus, Get, Param } from '@nestjs/common';
import { Response } from 'express';
import { AiService } from './ai.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('ai')
@Controller('Ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  // POST /Ai/summary
  @Get(':id/summary')
  @ApiOperation({
    summary: 'Summarize product description and all its reviews using AI',
    description:
      'Provide a product ID to generate a combined summary of the product description and all associated reviews.',
  })
  @ApiResponse({
    status: 200,
    description: 'Summary generated successfully',
    schema: {
      type: 'object',
      properties: {
        summary: {
          type: 'string',
          example:
            'A concise summary of the product features and customer feedback.',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input (e.g., missing product ID)',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({
    status: 500,
    description: 'Failed to generate summary (AI service error)',
  })
  async summarize(@Param('id') id: number, @Res() res: Response) {
    try {
      const summary = await this.aiService.summarizeProductInfoAndReviews({
        productId: id,
      });
      return res.status(HttpStatus.OK).json({ summary });
    } catch (error) {
      console.error('Error in /Ai/summary endpoint:', error.message);
      if (error.status === HttpStatus.NOT_FOUND) {
        // Check if it's a NotFoundException
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
