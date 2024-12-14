import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AppConfigService } from '../../app-config/app-config.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { DateService } from '../../../core/services/date.service';
import { AppError } from '../../../core/enums/app-error.enum';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable()
export class TokenService {
  // eslint-disable-next-line @typescript-eslint/max-params
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly jwtService: JwtService,
    private readonly dateService: DateService,
  ) {}

  verifyToken(refreshToken: string): { userId: string } {
    return this.jwtService.verify(refreshToken, {
      secret: this.appConfigService.jwtRefreshSecret,
    });
  }

  setCookies({
    response,
    userId,
    options,
  }: {
    response: Response;
    userId: string;
    options?: { both: boolean };
  }): void {
    const tokens = this.createTokens(userId);
    response.cookie(ACCESS_TOKEN_KEY, tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: this.dateService.convertToMilliseconds(this.appConfigService.jwtAccessExpiresIn),
    });
    if (options?.both) {
      response.cookie(REFRESH_TOKEN_KEY, tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: this.dateService.convertToMilliseconds(this.appConfigService.jwtRefreshExpiresIn),
      });
    }
  }

  createTokens(userId: string) {
    return {
      accessToken: this.jwtService.sign(
        { userId },
        {
          secret: this.appConfigService.jwtAccessSecret,
          expiresIn: this.appConfigService.jwtAccessExpiresIn,
        },
      ),
      refreshToken: this.jwtService.sign(
        { userId },
        {
          secret: this.appConfigService.jwtRefreshSecret,
          expiresIn: this.appConfigService.jwtRefreshExpiresIn,
        },
      ),
    };
  }

  handleRefreshTokenError(error: unknown) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedException({
        code: AppError.REFRESH_TOKEN_EXPIRED,
        message: `Refresh token expired`,
      });
    }
    throw new UnauthorizedException(error);
  }
}
