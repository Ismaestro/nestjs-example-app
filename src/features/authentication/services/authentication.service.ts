import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AppError } from '../../../core/enums/app-error.enum';
import { compare, hash } from 'bcrypt';
import { AppConfigService } from '../../app-config/app-config.service';
import { LanguageService } from '../../../core/services/language.service';
import { LoginRequest } from '../dto/login.request';
import { LoginResponse } from '../dto/login.response';
import { RegisterRequest } from '../dto/register.request';
import { Prisma, User } from '@prisma/client';
import { RegisterResponse } from '../dto/register.response';
import { PrismaError } from '../../../core/enums/prisma-error.enum';
import { RefreshTokenResponse } from '../dto/refresh-token.response';
import { UserRepository } from '../../user/user.repository';
import { TokenService } from './token.service';
import { TokenExpiredError } from '@nestjs/jwt';
import { RefreshTokenRequest } from '../dto/refresh-token.request';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger('AuthenticationService');

  // eslint-disable-next-line @typescript-eslint/max-params
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly languageService: LanguageService,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async register({
    registerRequest,
    acceptLanguage,
  }: {
    registerRequest: RegisterRequest;
    acceptLanguage: string;
  }): Promise<RegisterResponse> {
    const hashedPassword = await this.hashPassword(registerRequest.password);
    const language = this.languageService.parseAcceptLanguage(acceptLanguage);
    this.logger.log(`[Register]: user language calculated with value "${language}"`);

    try {
      const user = await this.userRepository.createUser({
        registerRequest,
        language,
        hashedPassword,
      });
      this.logger.log(`[Register]: user created with id "${user.id}"`);

      const tokens = this.tokenService.createTokens(user.id);
      this.logger.log(`[Register]: cookies set with tokens`);
      return { user, ...tokens };
    } catch (error) {
      return this.handleRegistrationError(error);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await hash(password, Number(this.appConfigService.bcryptSaltRounds));
    this.logger.log(`[Register]: password hashed successfully`);
    return hashedPassword;
  }

  private handleRegistrationError(error: unknown): never {
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

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const user = await this.validateUserCredentials(loginRequest);
    const tokens = this.tokenService.createTokens(user.id);
    this.logger.log(`[Login]: cookies set with tokens`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, ...tokens };
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

  async refreshToken(refreshTokenRequest: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const { userId } = this.tokenService.verifyToken(refreshTokenRequest.refreshToken);
      const tokens = this.tokenService.createTokens(userId);
      this.logger.log(`[Login]: token verified and cookies settle`);
      return { accessToken: tokens.accessToken };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          code: AppError.REFRESH_TOKEN_EXPIRED,
          message: `Refresh token expired`,
        });
      }
      throw new UnauthorizedException(error);
    }
  }
}
