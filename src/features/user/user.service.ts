import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AppError } from '../../core/enums/app-error.enum';
import { compare, hash } from 'bcrypt';
import { AppConfigService } from '../app-config/app-config.service';
import { LanguageService } from '../../core/services/language.service';
import { LoginRequest } from './dto/login.request';
import { LoginResponse } from './dto/login.response';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { GetMeResponse } from './dto/get-me.response';
import { RegisterRequest } from './dto/register.request';
import { Language, Prisma, User } from '@prisma/client';
import { RegisterResponse } from './dto/register.response';
import { PrismaError } from '../../core/enums/prisma-error.enum';
import { UpdateUserResponse } from './dto/update-user.response';
import { UpdateUserRequest } from './dto/update-user.request';
import { RefreshTokenResponse } from './dto/refresh-token.response';
import { Request, Response } from 'express';
import { DateService } from '../../core/services/date.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  // eslint-disable-next-line @typescript-eslint/max-params
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly jwtService: JwtService,
    private readonly languageService: LanguageService,
    private readonly userRepository: UserRepository,
    private readonly dateService: DateService,
  ) {}

  async register(
    registerRequest: RegisterRequest,
    acceptLanguage: string,
  ): Promise<RegisterResponse> {
    const hashedPassword = await this.hashPassword(registerRequest.password);
    const language = this.languageService.parseAcceptLanguage(acceptLanguage);
    this.logger.log(`[Register]: user language calculated with value "${language}"`);

    try {
      const user = await this.createUser({ registerRequest, hashedPassword, language });
      return {
        ...this.generateTokens({
          userId: user.id,
        }),
        user,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        this.logger.warn(`[Register]: user already exists`);
        throw new ConflictException({
          code: AppError.USER_DUPLICATED,
          message: `Unable to complete registration with the provided details`,
        });
      }
      throw new InternalServerErrorException(error);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await hash(password, Number(this.appConfigService.bcryptSaltRounds));
    this.logger.log(`[Register]: password hashed successfully`);
    return hashedPassword;
  }

  private async createUser(data: {
    registerRequest: RegisterRequest;
    language: Language;
    hashedPassword: string;
  }) {
    const user = await this.userRepository.createUser({
      registerRequest: data.registerRequest,
      language: data.language,
      hashedPassword: data.hashedPassword,
    });
    this.logger.log(`[Register]: user created with id "${user.id}"`);
    return user;
  }

  async login(loginRequest: LoginRequest, response: Response): Promise<LoginResponse> {
    const user = await this.validateUserCredentials(loginRequest);

    const tokens = this.generateTokens({ userId: user.id });
    this.logger.log(`[Login]: tokens generated`);

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: this.dateService.convertToMilliseconds(this.appConfigService.jwtRefreshExpiresIn),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return { accessToken: tokens.accessToken, user: userWithoutPassword } as LoginResponse;
  }

  private async validateUserCredentials(loginRequest: LoginRequest): Promise<User> {
    const user = await this.userRepository.getUserByEmail(loginRequest.email);
    if (!user) {
      throw new NotFoundException({
        code: AppError.INVALID_CREDENTIALS,
        message: `Invalid credentials`,
      });
    }
    this.logger.log(`[Login]: retrieved user "${user.id}" from the repository`);

    const passwordValid = await compare(loginRequest.password, user.password);
    if (!passwordValid) {
      throw new BadRequestException({
        code: AppError.INVALID_CREDENTIALS,
        message: `Invalid credentials`,
      });
    }
    this.logger.log(`[Login]: password validated`);
    return user;
  }

  async getMe(userId: string): Promise<GetMeResponse> {
    if (!userId) {
      throw new BadRequestException({
        code: AppError.USER_NOT_FOUND,
        message: `User not found`,
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
        code: AppError.UPDATE_USER,
        message: `Unable to update user`,
      });
    }
  }

  async refreshToken(request: Request, response: Response): Promise<RefreshTokenResponse> {
    const { refreshToken } = request.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException({
        code: AppError.TOKEN_NOT_FOUND,
        message: 'Refresh token is missing',
      });
    }

    const { userId } = this.jwtService.verify(refreshToken, {
      secret: this.appConfigService.jwtRefreshSecret,
    });
    this.logger.log(`[RefreshToken]: generated refresh token for user with id ${userId}`);

    const tokens = this.generateTokens({
      userId,
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: this.dateService.convertToMilliseconds(this.appConfigService.jwtRefreshExpiresIn),
    });

    return { accessToken: tokens.accessToken };
  }

  private generateTokens(payload: { userId: string }) {
    return {
      accessToken: this.generateToken(payload, {
        secret: this.appConfigService.jwtAccessSecret,
        expiresIn: this.appConfigService.jwtAccessExpiresIn,
      }),
      refreshToken: this.generateToken(payload, {
        secret: this.appConfigService.jwtRefreshSecret,
        expiresIn: this.appConfigService.jwtRefreshExpiresIn,
      }),
    };
  }

  private generateToken(
    payload: { userId: string },
    options: { secret: string; expiresIn: string },
  ): string {
    return this.jwtService.sign(payload, options);
  }
}
