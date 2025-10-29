import { Controller, Get, Logger, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';
import { LanguageTransformInterceptor } from '../../core/interceptors/language.interceptor';
import { LastUpdatedPokemonResponse } from './dto/last-updated-pokemon.response';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
@UseInterceptors(ResponseInterceptor)
@UseInterceptors(LanguageTransformInterceptor)
export class PokemonController {
  private readonly logger = new Logger('PokemonController');

  constructor(private readonly pokemonService: PokemonService) {}

  @Get('last-updated')
  async getLastUpdatedPokemonIds(): Promise<LastUpdatedPokemonResponse> {
    this.logger.log(`[GetLastUpdatedPokemonIds]: retrieve last updated pokemon ids`);
    return this.pokemonService.getLastUpdatedPokemonIds();
  }
}
