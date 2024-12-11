import { IsNotEmpty } from 'class-validator';
import { User } from '@prisma/client';

export class GetMeResponse {
  @IsNotEmpty()
  user!: Omit<User, 'password'>;
}
