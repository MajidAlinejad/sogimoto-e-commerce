// src/ai/ai.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from '../products/products.service';
import { ReviewsService } from '../reviews/reviews.service';
import { SummarizeRequestDto } from './dto/summarize-request.dto/summarize-request.dto';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private readonly openaiModel: string;
  private readonly openaiMaxTokens: number;
  private readonly openaiTemperature: number;

  constructor(
    private configService: ConfigService,
    private productsService: ProductsService,
    private reviewsService: ReviewsService,
  ) {
    const openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new InternalServerErrorException(
        'OPENAI_API_KEY is not set in environment variables',
      );
    }
    this.openai = new OpenAI({ apiKey: openaiApiKey });

    this.openaiModel = this.configService.get<string>(
      'OPENAI_MODEL',
      'gpt-3.5-turbo',
    );
    this.openaiMaxTokens = this.configService.get<number>(
      'OPENAI_MAX_TOKENS',
      200,
    );
    this.openaiTemperature = this.configService.get<number>(
      'OPENAI_TEMPERATURE',
      0.7,
    );
  }

  // Core function to call OpenAI for summarization
  private async getSummaryFromLLM(
    text: string,
    promptPrefix: string = 'Summarize the following text:\n\n',
  ): Promise<string> {
    if (!text || text.trim() === '') {
      return 'No content to summarize.';
    }

    try {
      const chatCompletion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: `${promptPrefix}${text}` }],
        model: this.openaiModel,
        max_tokens: this.openaiMaxTokens,
        temperature: this.openaiTemperature,
      });

      const choicesMessage =
        chatCompletion?.choices?.[0]?.message?.content?.trim();
      if (!choicesMessage) {
        return 'No choices.';
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return choicesMessage;
    } catch (error) {
      console.error(
        'Error calling OpenAI API for summary:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        'Failed to generate summary from AI service.',
      );
    }
  }

  // --- Specific Summarization Functions ---

  async summarizeProductDescription(productId: number): Promise<string> {
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    if (!product.description || product.description.trim() === '') {
      return 'Product has no description to summarize.';
    }

    return this.getSummaryFromLLM(
      product.description,
      'Summarize this product description concisely:\n\n',
    );
  }

  async summarizeProductReviews(productId: number): Promise<string> {
    const reviews = await this.reviewsService.findAllByProductId(productId);
    if (reviews.length === 0) {
      return 'No reviews available to summarize for this product.';
    }

    const combinedReviewText = reviews
      .map(
        (review, index) =>
          `Review ${index + 1} (Rating: ${review.rating}/5): "${review.comment}"`,
      )
      .join('\n\n');

    return this.getSummaryFromLLM(
      combinedReviewText,
      'Analyze and summarize the key points and overall sentiment from these customer reviews:\n\n',
    );
  }

  // New: General summary for raw text or product/reviews combination
  async getGenericOrCombinedSummary(
    summarizeRequest: SummarizeRequestDto,
  ): Promise<string> {
    if (summarizeRequest.text) {
      // Summarize raw text provided directly
      return this.getSummaryFromLLM(summarizeRequest.text);
    } else if (summarizeRequest.productId) {
      // Summarize product description AND reviews
      const product = await this.productsService.findOne(
        summarizeRequest.productId,
      );
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${summarizeRequest.productId} not found.`,
        );
      }

      const reviews = await this.reviewsService.findAllByProductId(
        summarizeRequest.productId,
      );

      let combinedText = `Product Description: ${product.description || 'No description provided.'}\n\n`;
      if (reviews.length > 0) {
        combinedText += 'User Reviews:\n';
        reviews.forEach((review, index) => {
          combinedText += `Review ${index + 1} (Rating: ${review.rating}/5): ${review.comment}\n`;
        });
      } else {
        combinedText += 'No reviews available for this product.\n';
      }

      return this.getSummaryFromLLM(
        combinedText,
        'Summarize the following product information and reviews:\n\n',
      );
    } else {
      throw new InternalServerErrorException(
        'No text or productId provided for summarization.',
      );
    }
  }
}
