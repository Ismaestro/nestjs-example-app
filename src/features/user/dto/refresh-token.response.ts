import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenResponse {
  @IsNotEmpty()
  @IsString()
  accessToken!: string;
}
