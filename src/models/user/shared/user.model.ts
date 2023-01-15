import { HideField, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../../shared/models/base.model';
import { Hero } from '../../hero/hero.model';

@ObjectType()
export class User extends BaseModel {
  email: string;
  firstname?: string;
  heroes: Hero[];
  language: string;
  votedHeroes: Hero[];
  @HideField()
  password: string;
}
