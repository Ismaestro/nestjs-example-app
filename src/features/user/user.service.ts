import { PrismaService } from 'nestjs-prisma';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../authentication/auth.service';
import { UpdateUserInput } from './dto/update-user.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { PublicError } from '../../core/enums/public-error.enum';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async getUserById(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      omit: {
        password: true,
      },
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException({
        code: PublicError.USER_NOT_FOUND,
        message: `User with ID ${userId} not found`,
      });
    }

    return user;
  }

  async updateUser(userId: string, userData: UpdateUserInput) {
    return this.prisma.user.update({
      data: userData,
      where: {
        id: userId,
      },
    });
  }

  async changePassword(user: { id: string; password: string; passwordInput: ChangePasswordInput }) {
    const passwordValid = await AuthService.validatePassword(
      user.passwordInput.oldPassword,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException({
        code: PublicError.INVALID_CREDENTIALS,
        message: `Invalid credentials`,
      });
    }

    const hashedPassword = await this.authService.hashPassword(user.passwordInput.updatedPassword);

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: user.id },
    });
  }
}
