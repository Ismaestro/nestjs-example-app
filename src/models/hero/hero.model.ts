import { ObjectType } from '@nestjs/graphql';
import { User } from '../user/shared/user.model';
import { BaseModel } from '../../shared/models/base.model';

@ObjectType()
export class Hero extends BaseModel {
  realName: string;
  alterEgo: string;
  published: boolean;
  image: string;
  votes: number;
  author: User;
}
