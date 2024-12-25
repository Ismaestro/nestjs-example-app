import { IsNumber } from 'class-validator';

export class CatchPokemonRequest {
  @IsNumber()
  pokemonId!: number;
}
