import { Module } from '@nestjs/common';
import { HeroResolver } from './hero.resolver';
import { HeroService } from './hero.service';

@Module({
  imports: [],
  providers: [HeroResolver, HeroService],
})
export class HeroModule {}
