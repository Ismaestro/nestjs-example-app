import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../models/user/shared/user.model';

@ObjectType()
export class Token {
  @Field({ description: 'JWT access token' })
  accessToken: string;

  @Field({ description: 'JWT refresh token' })
  refreshToken: string;

  @Field({ description: 'User' })
  user?: User;
}
