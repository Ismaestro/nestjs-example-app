import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenRequest {
  @IsNotEmpty()
  @IsJWT()
  refreshToken!: string;
}
