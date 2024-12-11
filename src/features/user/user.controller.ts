import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Patch,
  Post,
  Request,
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
import { RefreshTokenRequest } from './dto/refresh-token.request';

@Controller('user')
@UseInterceptors(ResponseInterceptor)
@UseInterceptors(LanguageTransformInterceptor)
export class UserController {
  private readonly logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  @Post('')
  async register(
    @Body() registerRequest: RegisterRequest,
    @Headers('accept-language') acceptLanguage: string,
  ): Promise<RegisterResponse> {
    registerRequest.email = registerRequest.email.trim().toLowerCase();
    this.logger.log(`[Register]: registering user with email "${registerRequest.email}"`);
    return this.userService.register(registerRequest, acceptLanguage);
  }

  @Post('login')
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    this.logger.log(`[Login]: attempting login user with email "${loginRequest.email}"`);
    return this.userService.login(loginRequest);
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

  @Post('refresh-token')
  @UseGuards(UserGuard)
  async refreshToken(
    @Body() refreshTokenRequest: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    this.logger.log(`[RefreshToken]: refreshing token`);
    return this.userService.refreshToken(refreshTokenRequest);
  }
}