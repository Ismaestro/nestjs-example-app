import { HideField, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Post } from '../../post/post.model';
import { BaseModel } from '../../../shared/models/base.model';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType()
export class User extends BaseModel {
  email: string;
  firstname?: string;
  lastname?: string;
  role: Role;
  posts: Post[];
  @HideField()
  password: string;
}
