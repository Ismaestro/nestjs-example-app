import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HeaderService {
  extractBearerToken(request: Request): string | null {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader?.startsWith('Bearer ')) {
      return null;
    }
    return authorizationHeader ? authorizationHeader.split(' ')[1] : '';
  }
}
