import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../user/shared/user.model';
import { BaseModel } from '../../shared/models/base.model';

@ObjectType()
export class Hero extends BaseModel {
  realName: string;
  alterEgo: string;
  published: boolean;
  image: string;
  @Field(() => Number, { nullable: true })
  votes: number;
  author: User;
  authorId: string;
  usersVoted: User[];
  userId: User;
}
