import { IsNotEmpty } from 'class-validator';
import { User } from '@prisma/client';

export class UpdateUserResponse {
  @IsNotEmpty()
  user!: Omit<User, 'password'>;
}
