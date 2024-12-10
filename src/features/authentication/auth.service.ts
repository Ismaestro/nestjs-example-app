import { PrismaService } from 'nestjs-prisma';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Language as PrismaLanguage, Prisma, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { SignupInput } from './dto/signup.input';
import { Token } from './token.model';
import { AuthErrors } from './enums/auth-errors';
import { PublicError } from '../../core/enums/public-error.enum';
import { Language } from '../../core/enums/language.enum';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class AuthService {
  // eslint-disable-next-line max-params
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly appConfigService: AppConfigService,
  ) {}

  static async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  async signup(payload: SignupInput, acceptLanguage: string): Promise<Token> {
    const hashedPassword = await this.hashPassword(payload.password);

    try {
      const language = this.parseAcceptLanguage(acceptLanguage);
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          language: language as unknown as PrismaLanguage,
          password: hashedPassword,
        },
      });

      return this.generateTokens({
        userId: user.id,
      });
    } catch (error_) {
      throw error_ instanceof Prisma.PrismaClientKnownRequestError &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        error_.code === AuthErrors.USER_DUPLICATED
        ? new ConflictException({
            code: PublicError.USER_DUPLICATED,
            message: `Email ${payload.email} already used.`,
          })
        : new Error(error_);
    }
  }

  async login(email: string, password: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException({
        code: PublicError.INVALID_CREDENTIALS,
        message: `Invalid credentials`,
      });
    }

    const passwordValid = await AuthService.validatePassword(password, user.password);

    if (!passwordValid) {
      throw new BadRequestException({
        code: PublicError.INVALID_CREDENTIALS,
        message: `Invalid credentials`,
      });
    }

    const tokens = this.generateTokens({
      userId: user.id,
    });

    return { ...tokens, ...user };
  }

  async deleteAccount(user: User, password: string) {
    const passwordValid = await AuthService.validatePassword(password, user.password);

    if (!passwordValid) {
      throw new BadRequestException({
        code: PublicError.INVALID_CREDENTIALS,
        message: `Invalid credentials`,
      });
    }

    await this.prisma.user.delete({
      where: { id: user.id },
    });

    return { deleted: true };
  }

  async refreshToken(token: string): Promise<Token> {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.appConfigService.jwtRefreshSecret,
      });

      return this.generateTokens({
        userId,
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  async getUser(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserFromToken(token: string): Promise<User | null> {
    const id = this.jwtService.decode(token).userId;
    return this.getUser(id);
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password, Number(this.appConfigService.bcryptSaltRounds));
  }

  private parseAcceptLanguage(acceptLanguage: string): Language {
    if (!acceptLanguage) {
      return this.appConfigService.defaultLanguage;
    }

    const supportedLanguages = Object.values(Language);
    const languages = acceptLanguage.split(',').map((lang) => lang.split(';')[0].trim());
    for (const lang of languages) {
      if (supportedLanguages.includes(lang as Language)) {
        return lang as Language;
      }
    }

    return this.appConfigService.defaultLanguage;
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: this.appConfigService.jwtRefreshExpiresIn,
    });
  }

  private generateRefreshToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: this.appConfigService.jwtRefreshExpiresIn,
    });
  }
}
