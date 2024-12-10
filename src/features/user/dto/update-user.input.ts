import { IsOptional, IsString } from 'class-validator';
import { Language } from '@prisma/client';

export class UpdateUserInput {
  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  language?: Language;
}
