import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AppConfigService } from '../app-config/app-config.service';
import { HeaderService } from '../../core/services/header.service';
import { AppError } from '../../core/enums/app-error.enum';

@Injectable()
export class UserGuard implements CanActivate {
  // eslint-disable-next-line @typescript-eslint/max-params
  constructor(
    private readonly jwtService: JwtService,
    private readonly headerService: HeaderService,
    private readonly appConfigService: AppConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.headerService.extractBearerToken(request);
    if (!token) {
      throw new UnauthorizedException({
        code: AppError.TOKEN_NOT_FOUND,
        message: `Token not found`,
      });
    }

    const decodedToken = this.jwtService.verify(token, {
      secret: this.appConfigService.jwtAccessSecret,
    });
    if (!decodedToken) {
      throw new UnauthorizedException({
        code: AppError.TOKEN_EXPIRED,
        message: `Token expired`,
      });
    }

    // @ts-expect-error: Property userId is dynamically added to the request object in the JWT Auth Guard
    request.userId = decodedToken.userId;

    return true;
  }
}
