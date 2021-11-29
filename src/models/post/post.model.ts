import { ObjectType } from '@nestjs/graphql';
import { User } from '../user/shared/user.model';
import { BaseModel } from '../../shared/models/base.model';

@ObjectType()
export class Post extends BaseModel {
  title: string;
  content: string;
  published: boolean;
  author: User;
}
