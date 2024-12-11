import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '@prisma/client';

export class LoginResponse {
  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  @IsNotEmpty()
  @IsString()
  refreshToken!: string;

  @IsNotEmpty()
  user!: Omit<User, 'password'>;
}
