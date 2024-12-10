import { IsOptional } from 'class-validator';

export class DeleteAccountInput {
  @IsOptional()
  password: string;
}
