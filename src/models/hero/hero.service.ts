import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { User } from '../user/shared/user.model';
import { CreateHeroInput } from './dto/create-hero.input';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { UserIdArgs } from '../user/dto/user-id.args';
import { HeroIdArgs } from './dto/hero-id.args';
import { Hero } from './hero.model';

@Injectable()
export class HeroService {
  constructor(private prisma: PrismaService) {}

  async createHero(user: User, data: CreateHeroInput) {
    return this.prisma.hero.create({
      data: {
        realName: data.realName,
        alterEgo: data.alterEgo,
        published: false,
        image: '',
        votes: 0,
        authorId: user.id,
      },
    });
  }

  async searchHeroes(query, { after, before, first, last }, orderBy) {
    return findManyCursorConnection(
      (args) =>
        this.prisma.hero.findMany({
          include: { author: false },
          where: {
            alterEgo: { contains: query || '' },
            published: true,
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

  getUserHeroes(userIdArgs: UserIdArgs) {
    return this.prisma.user
      .findUnique({ where: { id: userIdArgs.userId } })
      .heroes();
  }

  getHero(heroIdArgs: HeroIdArgs) {
    return this.prisma.hero.findUnique({ where: { id: heroIdArgs.heroId } });
  }

  getAuthor(hero: Hero) {
    return this.prisma.hero.findUnique({ where: { id: hero.id } }).author();
  }
}
