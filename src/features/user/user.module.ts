import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthModule } from '../authentication/auth.module';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { AppConfigModule } from '../app-config/app-config.module';

@Module({
  imports: [AppConfigModule, AuthModule],
  providers: [UserService, JwtService],
  controllers: [UserController],
})
export class UserModule {}
