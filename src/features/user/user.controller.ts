import { Body, Controller, Get, Logger, Put, Request, UseGuards } from '@nestjs/common';
import { UserService } from 'src/features/user/user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { AuthGuard } from '../authentication/auth.guard';
import { User } from '@prisma/client';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  private readonly logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  @Get('')
  async getMe(@Request() request: { userId: string }): Promise<Omit<User, 'password'>> {
    const { userId } = request;
    this.logger.verbose(`User "${userId}" retrieving himself.`);
    return this.userService.getUserById(userId);
  }

  @Put('update')
  async updateUser(
    @Request() request: { user: User },
    @Body() userData: UpdateUserInput,
  ): Promise<User> {
    const { user } = request;
    this.logger.verbose(`User "${user.email}" updating profile.`);
    return this.userService.updateUser(user.id, userData);
  }

  @Put('change-password')
  async changePassword(
    @Request() request: { user: User },
    @Body() changePasswordInput: ChangePasswordInput,
  ): Promise<User> {
    const { user } = request;
    this.logger.verbose(`User "${user.email}" changing password.`);
    return this.userService.changePassword({
      id: user.id,
      password: user.password,
      passwordInput: changePasswordInput,
    });
  }
}
