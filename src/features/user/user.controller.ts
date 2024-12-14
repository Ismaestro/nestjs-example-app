import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from 'src/features/user/user.service';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import { GetMeResponse } from './dto/get-me.response';
import { ResponseInterceptor } from '../../core/interceptors/response.interceptor';
import { LanguageTransformInterceptor } from '../../core/interceptors/language.interceptor';
import { UpdateUserRequest } from './dto/update-user.request';
import { UpdateUserResponse } from './dto/update-user.response';

@Controller('user')
@UseInterceptors(ResponseInterceptor)
@UseInterceptors(LanguageTransformInterceptor)
export class UserController {
  private readonly logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(AuthenticationGuard)
  async getMe(@Request() request: { userId: string }): Promise<GetMeResponse> {
    const { userId } = request;
    this.logger.log(`[GetMe]: user with id "${userId}" retrieving himself`);
    return this.userService.getMe(userId);
  }

  @Patch('')
  @UseGuards(AuthenticationGuard)
  async updateUser(
    @Request() request: { userId: string },
    @Body() updateUserRequest: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    const { userId } = request;
    this.logger.log(`[UpdateUser]: user with id "${userId}" updating itself`);
    return this.userService.updateUser(userId, updateUserRequest);
  }
}
