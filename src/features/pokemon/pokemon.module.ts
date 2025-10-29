import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { AppConfigModule } from '../app-config/app-config.module';
import { LanguageService } from '../../core/services/language.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AppConfigModule],
  providers: [LanguageService, JwtService, PokemonService],
  controllers: [PokemonController],
})
export class PokemonModule {}
