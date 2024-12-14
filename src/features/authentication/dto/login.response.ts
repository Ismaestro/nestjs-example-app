import { IsNotEmpty } from 'class-validator';
import { User } from '@prisma/client';

export class LoginResponse {
  @IsNotEmpty()
  user!: Omit<User, 'password'>;
}
