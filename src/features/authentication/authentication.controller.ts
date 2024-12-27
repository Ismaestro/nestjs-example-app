import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { LoginRequest } from './dto/login.request';
import { LoginResponse } from './dto/login.response';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';
import { RegisterRequest } from './dto/register.request';
import { LanguageTransformInterceptor } from '../../core/interceptors/language.interceptor';
import { RegisterResponse } from './dto/register.response';
import { RefreshTokenResponse } from './dto/refresh-token.response';
import { AuthenticationService } from './services/authentication.service';
import { AppError } from '../../core/enums/app-error.enum';
import { RefreshTokenRequest } from './dto/refresh-token.request';

@Controller('authentication')
@UseInterceptors(ResponseInterceptor)
@UseInterceptors(LanguageTransformInterceptor)
export class AuthenticationController {
  private readonly logger = new Logger('UserController');

  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('')
  async register(
    @Body() registerRequest: RegisterRequest,
    @Headers('accept-language') acceptLanguage: string,
  ): Promise<RegisterResponse> {
    // TODO: try to do it with class validator
    if (!registerRequest.terms) {
      throw new BadRequestException({
        code: AppError.TERMS_MUST_BE_TRUE,
        message: `You must accept the terms and conditions`,
      });
    }
    registerRequest.email = registerRequest.email.trim().toLowerCase();
    this.logger.log(`[Register]: registering user with email "${registerRequest.email}"`);
    return this.authenticationService.register({ registerRequest, acceptLanguage });
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    this.logger.log(`[Login]: attempting login user with email "${loginRequest.email}"`);
    return this.authenticationService.login(loginRequest);
  }

  @Post('token/refresh')
  @HttpCode(200)
  async refreshToken(
    @Body() refreshTokenRequest: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    this.logger.log(`[RefreshToken]: refreshing token`);
    return this.authenticationService.refreshToken(refreshTokenRequest);
  }
}
