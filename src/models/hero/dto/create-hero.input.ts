import { IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateHeroInput {
  @Field()
  @IsNotEmpty()
  realName: string;

  @Field()
  @IsNotEmpty()
  alterEgo: string;
}
