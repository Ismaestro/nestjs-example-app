import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '@prisma/client';

export class LoginResponse {
  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  @IsNotEmpty()
  user!: Omit<User, 'password'>;
}
