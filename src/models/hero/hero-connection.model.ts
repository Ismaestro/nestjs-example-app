import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from './pagination/pagination';
import { Hero } from './hero.model';

@ObjectType()
export class HeroConnection extends PaginatedResponse(Hero) {}
