import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { AppConfigService } from '../app-config/app-config.service';
import { AppError } from '../../core/enums/app-error.enum';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { accessToken } = request.cookies;
    if (!accessToken) {
      throw new UnauthorizedException({
        code: AppError.TOKEN_NOT_FOUND,
        message: `Token not found`,
      });
    }

    try {
      this.jwtService.verify(accessToken, {
        secret: this.appConfigService.jwtAccessSecret,
      });
    } catch (error) {
      this.handleError(error);
      return false;
    }

    // @ts-expect-error: Property userId is dynamically added to the request object in the JWT Auth Guard
    request.userId = decodedToken.userId;

    return true;
  }

  handleError(error: unknown) {
    if (error instanceof TokenExpiredError) {
      throw new UnauthorizedException({
        code: AppError.ACCESS_TOKEN_EXPIRED,
        message: `Access token expired`,
      });
    }
    throw new UnauthorizedException(error);
  }
}
