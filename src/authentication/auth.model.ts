import { ObjectType } from '@nestjs/graphql';
import { User } from '../models/user/shared/user.model';
import { Token } from './token.model';

@ObjectType()
export class Auth extends Token {
  user: User;
}
