import { Field, InputType } from '@nestjs/graphql';
import { Language } from '@prisma/client';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  firstname?: string;
  @Field({ nullable: true })
  language?: Language;
}
