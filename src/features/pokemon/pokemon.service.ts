import { Injectable, Logger } from '@nestjs/common';
import { LastUpdatedPokemonResponse } from './dto/last-updated-pokemon.response';

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
    const numbers = new Set();

    while (numbers.size < length) {
      const randomNumber = Math.floor(Math.random() * 1000) + 1;
      numbers.add(String(randomNumber));
    }

    return [...numbers] as string[];
  }
}
