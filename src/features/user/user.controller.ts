import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Logger,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from 'src/features/user/user.service';
import { UserGuard } from './user.guard';
import { LoginRequest } from './dto/login.request';
import { LoginResponse } from './dto/login.response';
import { GetMeResponse } from './dto/get-me.response';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';
import { RegisterRequest } from './dto/register.request';
import { LanguageTransformInterceptor } from '../../core/interceptors/language.interceptor';
import { RegisterResponse } from './dto/register.response';
import { UpdateUserRequest } from './dto/update-user.request';
import { UpdateUserResponse } from './dto/update-user.response';
import { RefreshTokenResponse } from './dto/refresh-token.response';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

@Controller('user')
@UseInterceptors(ResponseInterceptor)
@UseInterceptors(LanguageTransformInterceptor)
export class UserController {
  private readonly logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  // eslint-disable-next-line @typescript-eslint/max-params
  @Post('')
  async register(
    @Body() registerRequest: RegisterRequest,
    @Headers('accept-language') acceptLanguage: string,
    @Res({ passthrough: true }) response: ExpressResponse,
  ): Promise<RegisterResponse> {
    registerRequest.email = registerRequest.email.trim().toLowerCase();
    this.logger.log(`[Register]: registering user with email "${registerRequest.email}"`);
    return this.userService.register({ registerRequest, acceptLanguage, response });
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginRequest: LoginRequest,
    @Res({ passthrough: true }) response: ExpressResponse,
  ): Promise<LoginResponse> {
    this.logger.log(`[Login]: attempting login user with email "${loginRequest.email}"`);
    return this.userService.login(loginRequest, response);
  }

  @Post('token/refresh')
  @HttpCode(200)
  async refreshToken(
    @Request() request: ExpressRequest,
    @Res({ passthrough: true }) response: ExpressResponse,
  ): Promise<RefreshTokenResponse> {
    this.logger.log(`[RefreshToken]: refreshing token`);
    return this.userService.refreshToken(request, response);
  }

  @Get('')
  @UseGuards(UserGuard)
  async getMe(@Request() request: { userId: string }): Promise<GetMeResponse> {
    const { userId } = request;
    this.logger.log(`[GetMe]: user with id "${userId}" retrieving himself`);
    return this.userService.getMe(userId);
  }

  @Patch('')
  @UseGuards(UserGuard)
  async updateUser(
    @Request() request: { userId: string },
    @Body() updateUserRequest: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    const { userId } = request;
    this.logger.log(`[UpdateUser]: user with id "${userId}" updating itself`);
    return this.userService.updateUser(userId, updateUserRequest);
  }
}
