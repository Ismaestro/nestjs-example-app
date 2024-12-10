import {
  Body,
  Controller,
  Delete,
  Headers,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { AuthGuard } from './auth.guard';
import { DeleteAccountInput } from './dto/delete-account.input';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: SignupInput, @Headers('accept-language') acceptLanguage: string) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.authService.signup(data, acceptLanguage);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('login')
  async login(@Body() { email, password }: LoginInput) {
    const { accessToken, refreshToken } = await this.authService.login(
      email.toLowerCase(),
      password,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Post('refresh-token')
  async refreshToken(@Body() { token }: RefreshTokenInput) {
    return this.authService.refreshToken(token);
  }

  @UseGuards(AuthGuard)
  @Delete('delete-account')
  @HttpCode(200)
  async deleteAccount(
    @Request() request: { user: User },
    @Body() { password }: DeleteAccountInput,
  ): Promise<{ deleted: boolean }> {
    return this.authService.deleteAccount(request.user, password);
  }

  @Post('user-from-token')
  async getUserFromToken(@Body('accessToken') accessToken: string) {
    return this.authService.getUserFromToken(accessToken);
  }
}
