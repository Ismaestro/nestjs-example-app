import { Injectable, Logger } from '@nestjs/common';
import { LastUpdatedPokemonResponse } from './dto/last-updated-pokemon.response';

@Injectable()
export class PokemonService {
  private readonly logger = new Logger('UserService');

  async getLastUpdatedPokemonIds(): Promise<LastUpdatedPokemonResponse> {
    this.logger.log(`[GetLastUpdatedPokemonIds]: return random numbers`);
    return { pokemonIds: this.getRandomArray() };
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
