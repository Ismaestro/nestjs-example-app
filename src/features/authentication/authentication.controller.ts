import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  Request,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { LoginRequest } from './dto/login.request';
import { LoginResponse } from './dto/login.response';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';
import { RegisterRequest } from './dto/register.request';
import { LanguageTransformInterceptor } from '../../core/interceptors/language.interceptor';
import { RegisterResponse } from './dto/register.response';
import { RefreshTokenResponse } from './dto/refresh-token.response';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { AuthenticationService } from './services/authentication.service';

@Controller('authentication')
@UseInterceptors(ResponseInterceptor)
@UseInterceptors(LanguageTransformInterceptor)
export class AuthenticationController {
  private readonly logger = new Logger('UserController');

  constructor(private readonly authenticationService: AuthenticationService) {}

  // eslint-disable-next-line @typescript-eslint/max-params
  @Post('')
  async register(
    @Body() registerRequest: RegisterRequest,
    @Headers('accept-language') acceptLanguage: string,
    @Res({ passthrough: true }) response: ExpressResponse,
  ): Promise<RegisterResponse> {
    registerRequest.email = registerRequest.email.trim().toLowerCase();
    this.logger.log(`[Register]: registering user with email "${registerRequest.email}"`);
    return this.authenticationService.register({ registerRequest, acceptLanguage, response });
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginRequest: LoginRequest,
    @Res({ passthrough: true }) response: ExpressResponse,
  ): Promise<LoginResponse> {
    this.logger.log(`[Login]: attempting login user with email "${loginRequest.email}"`);
    return this.authenticationService.login(loginRequest, response);
  }

  @Post('token/refresh')
  @HttpCode(200)
  async refreshToken(
    @Request() request: ExpressRequest,
    @Res({ passthrough: true }) response: ExpressResponse,
  ): Promise<RefreshTokenResponse> {
    this.logger.log(`[RefreshToken]: refreshing token`);
    return this.authenticationService.refreshToken(request, response);
  }
}
