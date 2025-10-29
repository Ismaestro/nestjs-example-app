import { IsNotEmpty } from 'class-validator';

export class LastUpdatedPokemonResponse {
  @IsNotEmpty()
  pokemonIds!: string[];
}
