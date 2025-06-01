// src/ai/dto/summarize-request.dto.ts
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SummarizeRequestDto {
  @ApiProperty({
    description:
      'ID of the product whose description and reviews should be summarized.',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsNotEmpty() // productId is now required
  @Min(1)
  productId: number;
}
