import { Injectable, Logger } from '@nestjs/common';
import { LastUpdatedPokemonResponse } from './dto/last-updated-pokemon.response';
import { POKEMON_NAMES } from './pokemon.constants';

@Injectable()
export class PokemonService {
  private readonly logger = new Logger('UserService');

  private lastResponse: LastUpdatedPokemonResponse | null = null;
  private lastTimestamp = 0;

  async getLastUpdatedPokemonIds(): Promise<LastUpdatedPokemonResponse> {
    const now = Date.now();

    const DELAY_SECONDS = 10_000;
    if (this.lastResponse && now - this.lastTimestamp < DELAY_SECONDS) {
      this.logger.log('[GetLastUpdatedPokemonIds]: returning cached response');
      return this.lastResponse;
    }

    this.logger.log('[GetLastUpdatedPokemonIds]: generating new response');
    const response = { pokemonIds: this.getRandomArray() };

    this.lastResponse = response;
    this.lastTimestamp = now;

    return response;
  }

  private getRandomArray(): string[] {
    const length = Math.floor(Math.random() * 3) + 1;
    const selected = new Set<string>();
    while (selected.size < length) {
      const randomIndex = Math.floor(Math.random() * POKEMON_NAMES.length);
      selected.add(POKEMON_NAMES[randomIndex]);
    }
    selected.add('pikachu');
    return [...selected];
  }
}
