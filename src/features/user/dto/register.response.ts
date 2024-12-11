import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '@prisma/client';

export class RegisterResponse {
  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  @IsNotEmpty()
  @IsString()
  refreshToken!: string;

  @IsNotEmpty()
  user!: Omit<User, 'password'>;
}
