import type { User } from '@prisma/client';

export class Token {
  accessToken: string;
  refreshToken: string;
  user?: User;
}
