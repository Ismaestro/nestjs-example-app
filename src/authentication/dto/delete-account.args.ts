import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class DeleteAccountArgs {
  @Field()
  @IsOptional()
  password: string;
}
