import { PrismaService } from 'nestjs-prisma';
import { PaginationArgs } from './pagination/pagination.args';
import { UserIdArgs } from '../user/dto/user-id.args';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { PubSub } from 'graphql-subscriptions/';
import { UserEntity } from 'src/models/user/user.decorator';
import { User } from 'src/models/user/shared/user.model';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../../authentication/graphql-auth.guard';
import { Hero } from './hero.model';
import { CreateHeroInput } from './dto/create-hero.input';
import { HeroConnection } from './hero-connection.model';
import { HeroOrder } from './dto/hero-order.input';
import { HeroIdArgs } from './dto/hero-id.args';

const pubSub = new PubSub();

@Resolver(() => Hero)
export class HeroResolver {
  constructor(private prisma: PrismaService) {}

  @Subscription(() => Hero)
  heroCreated() {
    return pubSub.asyncIterator('heroCreated');
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Hero)
  async createHero(
    @UserEntity() user: User,
    @Args('data') data: CreateHeroInput
  ) {
    const newHero = this.prisma.hero.create({
      data: {
        realName: data.realName,
        alterEgo: data.alterEgo,
        published: false,
        image: '',
        votes: 0,
        authorId: user.id,
      },
    });
    await pubSub.publish('heroCreated', { heroCreated: newHero });
    return newHero;
  }

  @Query(() => HeroConnection)
  async searchHeroes(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    query: string,
    @Args({
      name: 'orderBy',
      type: () => HeroOrder,
      nullable: true,
    })
    orderBy: HeroOrder
  ) {
    return await findManyCursorConnection(
      (args) =>
        this.prisma.hero.findMany({
          include: { author: true },
          where: {
            alterEgo: { contains: query || '' },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : null,
          ...args,
        }),
      () =>
        this.prisma.hero.count({
          where: {
            alterEgo: { contains: query || '' },
          },
        }),
      { first, last, before, after }
    );
  }

  @Query(() => [Hero])
  userHeroes(@Args() id: UserIdArgs) {
    return this.prisma.user.findUnique({ where: { id: id.userId } }).heroes();
  }

  @Query(() => Hero)
  async hero(@Args() heroIdArgs: HeroIdArgs) {
    return this.prisma.hero.findUnique({ where: { id: heroIdArgs.heroId } });
  }

  @ResolveField('author')
  async author(@Parent() hero: Hero) {
    return this.prisma.hero.findUnique({ where: { id: hero.id } }).author();
  }
}
