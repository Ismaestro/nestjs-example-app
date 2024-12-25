import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { AppError } from '../../core/enums/app-error.enum';
import { LanguageService } from '../../core/services/language.service';
import { UserRepository } from './user.repository';
import { GetMeResponse } from './dto/get-me.response';
import { User } from '@prisma/client';
import { UpdateUserResponse } from './dto/update-user.response';
import { UpdateUserRequest } from './dto/update-user.request';
import { CatchPokemonRequest } from './dto/catch-pokemon.request';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    private readonly languageService: LanguageService,
    private readonly userRepository: UserRepository,
  ) {}

  async getMe(userId: string): Promise<GetMeResponse> {
    if (!userId) {
      throw new BadRequestException({
        code: AppError.USER_NOT_FOUND,
        message: `User id not found`,
      });
    }
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new BadRequestException({
        code: AppError.USER_NOT_FOUND,
        message: `User with id ${userId} not found`,
      });
    }
    this.logger.log(`[GetMe]: retrieved user "${user.id}" from the repository`);
    return { user };
  }

  async updateUser(
    userId: string,
    updateUserRequest: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    if (!userId) {
      throw new BadRequestException({
        code: AppError.USER_NOT_FOUND,
        message: `User not found`,
      });
    }
    try {
      // @ts-expect-error: partial user may have language or not
      const userToUpdate: Partial<User> = {
        ...updateUserRequest,
      };

      if (updateUserRequest.language) {
        userToUpdate.language = this.languageService.convertAppLanguage(updateUserRequest.language);
      }

      const userUpdated = await this.userRepository.updateUserById(userId, userToUpdate as User);
      this.logger.log(`[UpdateUser]: user updated successfully`);
      return { user: userUpdated };
    } catch {
      throw new BadRequestException({
        code: AppError.UPDATE_USER_FAILED,
        message: `Unable to update user`,
      });
    }
  }

  async catchPokemon(
    userId: string,
    catchPokemonRequest: CatchPokemonRequest,
  ): Promise<UpdateUserResponse> {
    if (!userId) {
      throw new BadRequestException({
        code: AppError.USER_NOT_FOUND,
        message: `User not found`,
      });
    }

    const userWithoutPokemon = await this.userRepository.getUserById(userId);
    if (!userWithoutPokemon) {
      throw new BadRequestException({
        code: AppError.USER_NOT_FOUND,
        message: `User with id ${userId} not found`,
      });
    }

    return this.addPokemonToUser({ userId, userWithoutPokemon, catchPokemonRequest });
  }

  private async addPokemonToUser(data: {
    userId: string;
    userWithoutPokemon: Omit<User, 'password'>;
    catchPokemonRequest: CatchPokemonRequest;
  }) {
    const pokemonsCaught = data.userWithoutPokemon.caughtPokemonIds;
    const { pokemonId } = data.catchPokemonRequest;
    if (pokemonsCaught.includes(pokemonId)) {
      throw new ConflictException({
        code: AppError.POKEMON_ALREADY_CAUGHT,
        message: `You already have caught pokemon with id: ${pokemonId}`,
      });
    }
    pokemonsCaught.push(pokemonId);

    try {
      const userUpdated = await this.userRepository.updateUserById(data.userId, {
        ...data.userWithoutPokemon,
        caughtPokemonIds: pokemonsCaught,
      });
      this.logger.log(`[CatchPokemon]: user updated successfully`);
      return { user: userUpdated };
    } catch {
      throw new BadRequestException({
        code: AppError.UPDATE_USER_FAILED,
        message: `Unable to update user`,
      });
    }
  }
}
