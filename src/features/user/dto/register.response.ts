import { IsNotEmpty } from 'class-validator';
import { User } from '@prisma/client';

export class RegisterResponse {
  @IsNotEmpty()
  user!: Omit<User, 'password'>;
}
