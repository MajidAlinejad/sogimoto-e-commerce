// src/users/dto/user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { User as PrismaUser } from '@prisma/client'; // Import Prisma's User type

export class UserDto implements PrismaUser {
  @ApiProperty({ description: 'Unique identifier of the user', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'alinejad.mj@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Hashed password of the user (for internal use only)',
    example: 'hashedpassword123',
    writeOnly: true,
  })
  password: string;
}
