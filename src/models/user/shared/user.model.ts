import { HideField, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from '../../../shared/models/base.model';
import { Hero } from '../../hero/hero.model';

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
  heroes: Hero[];
  @HideField()
  password: string;
}
