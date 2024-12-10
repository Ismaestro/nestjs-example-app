import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const decodedToken = this.jwtService.verify(token, {
      secret: this.appConfigService.jwtRefreshSecret,
    });

    if (!decodedToken) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // @ts-expect-error: Property userId is dynamically added to the request object in the JWT Auth Guard
    request.userId = decodedToken.userId;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    return authHeader ? authHeader.split(' ')[1] : '';
  }
}
