import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class OkResponse {
  @Field()
  ok: boolean;
}
