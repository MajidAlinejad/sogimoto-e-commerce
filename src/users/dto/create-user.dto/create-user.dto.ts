import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'alinejad.mj@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456789',
    required: true,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string; // In a real app, it gonna be a hash value
}
