import { Injectable } from '@nestjs/common';
import { Language, User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { RegisterRequest } from './dto/register.request';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: {
    registerRequest: RegisterRequest;
    language: Language;
    hashedPassword: string;
  }): Promise<Omit<User, 'password'>> {
    return this.prisma.user.create({
      omit: {
        password: true,
      },
      data: {
        ...data.registerRequest,
        language: data.language,
        password: data.hashedPassword,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    return this.prisma.user.findUnique({
      omit: {
        password: true,
      },
      where: {
        id: userId,
      },
    });
  }

  async updateUserById(userId: string, userData: User): Promise<Omit<User, 'password'>> {
    return this.prisma.user.update({
      omit: {
        password: true,
      },
      data: userData,
      where: {
        id: userId,
      },
    });
  }
}
