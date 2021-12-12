import { PrismaService } from 'nestjs-prisma';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../user/shared/user.model';
import { CreateHeroInput } from './dto/create-hero.input';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { HeroIdArgs } from './dto/hero-id.args';
import { Hero } from './hero.model';
import { PublicErrors } from '../../shared/enums/public-errors.enum';

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
        authorId: user.id,
      },
    });
  }

  async voteHero(user: User, heroIdArgs: HeroIdArgs) {
    const heroToVote = await this.getHero(heroIdArgs);
    if (!heroToVote || !heroToVote.published) {
      throw new NotFoundException({
        code: PublicErrors.HERO_NOT_FOUND,
        message: `Hero not found`,
      });
    }

    try {
      return await this.prisma.hero.update({
        where: { id: heroIdArgs.heroId },
        data: {
          usersVoted: {
            create: [
              {
                assignedAt: new Date(),
                userId: user.id,
              },
            ],
          },
        },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException({
          code: PublicErrors.HERO_ALREADY_VOTED,
          message: `You already voted this hero. Just once please.`,
        });
      }
    }
  }

  async searchHeroes(query, { after, before, first, last }, orderBy) {
    return findManyCursorConnection(
      (args) =>
        this.prisma.hero.findMany({
          include: {
            author: false,
            usersVoted: true,
            _count: {
              select: { usersVoted: true },
            },
          },
          where: {
            alterEgo: { contains: query || '' },
            published: true,
          },
          orderBy: (orderBy.field === 'usersVoted') ? {
            usersVoted: {
              _count: orderBy.direction,
            }
          } : orderBy ? { [orderBy.field] : orderBy.direction } : null,
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

  getHero(heroIdArgs: HeroIdArgs) {
    return this.prisma.hero.findUnique({
      include: {usersVoted: true},
      where: { id: heroIdArgs.heroId },
    });
  }

  async getHeroVotes(heroIdArgs: HeroIdArgs) {
    const heroVotes = await this.prisma.votesOnHeroes.findMany({
      where: {
        hero: {
          id: heroIdArgs.heroId,
        },
      },
    });
    return { votes: heroVotes.length };
  }

  getAuthor(hero: Hero) {
    return this.prisma.hero.findUnique({ where: { id: hero.id } }).author();
  }
}
