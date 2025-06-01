// src/ai/dto/summarize-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class SummarizeRequestDto {
  @ApiProperty({
    description:
      'Raw text to be summarized. Mutually exclusive with productId.',
    example: 'This is a long piece of text that needs to be condensed.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string; // Raw text to summarize

  @ApiProperty({
    description:
      'ID of the product whose description and reviews should be summarized. Mutually exclusive with text.',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  productId?: number; // Product ID to summarize its description and/or reviews
}
