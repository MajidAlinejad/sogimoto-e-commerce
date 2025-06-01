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
        'OPENAI_API_KEY is not set in environment variables.',
      );
    }
    this.openai = new OpenAI({ apiKey: openaiApiKey });

    this.openaiModel = this.configService.get<string>(
      'OPENAI_MODEL',
      'gpt-3.5-turbo',
    );

    this.openaiMaxTokens = parseInt(
      this.configService.get<string>('OPENAI_MAX_TOKENS', '500'),
      10,
    );

    this.openaiTemperature = parseFloat(
      this.configService.get<string>('OPENAI_TEMPERATURE', '0.7'),
    );
  }

  private async getSummaryFromLLM(
    text: string,
    promptPrefix: string,
  ): Promise<string> {
    if (!text || text.trim() === '') {
      return 'No relevant content found to summarize.';
    }

    try {
      const chatCompletion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: `${promptPrefix}${text}` }],
        model: this.openaiModel,
        max_tokens: this.openaiMaxTokens, // This will now be a number
        temperature: this.openaiTemperature,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return chatCompletion?.choices?.[0]?.message?.content?.trim() as string;
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

  async summarizeProductInfoAndReviews(
    summarizeRequest: SummarizeRequestDto,
  ): Promise<string> {
    const { productId } = summarizeRequest;

    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    const reviews = await this.reviewsService.findAllByProductId(productId);

    let combinedText = '';

    combinedText += `Product Name: ${product.name}\n`;
    combinedText += `Product Price: $${product.price.toFixed(2)}\n\n`;

    if (product.description && product.description.trim() !== '') {
      combinedText += `Product Description: ${product.description}\n\n`;
    } else {
      combinedText += 'No product description available.\n\n';
    }

    if (reviews.length > 0) {
      combinedText += 'Customer Reviews:\n';
      reviews.forEach((review, index) => {
        combinedText += `Review ${index + 1} (Rating: ${review.rating}/5): "${review.comment}"\n`;
      });
    } else {
      combinedText += 'No reviews available for this product.\n';
    }

    const promptPrefix =
      'Based on the following product information (name, price, description) and customer reviews, provide a concise summary that highlights key features, common sentiments, and overall impression. If there are no reviews or descriptions, state that.\n\n';
    console.log(combinedText);
    return this.getSummaryFromLLM(combinedText, promptPrefix);
  }
}
