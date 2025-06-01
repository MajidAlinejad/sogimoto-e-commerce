// src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/swagger'; // Import PartialType from @nestjs/swagger
import { CreateUserDto } from '../create-user.dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // All properties inherited from CreateUserDto will be optional.
  // You can add specific update-only properties here if needed.
}
