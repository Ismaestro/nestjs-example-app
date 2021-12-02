import { Module } from '@nestjs/common';
import { HeroResolver } from './hero.resolver';

@Module({
  imports: [],
  providers: [HeroResolver],
})
export class HeroModule {}
