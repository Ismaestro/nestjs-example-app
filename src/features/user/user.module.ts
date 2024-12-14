import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AppConfigModule } from '../app-config/app-config.module';
import { LanguageService } from '../../core/services/language.service';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AppConfigModule],
  providers: [LanguageService, JwtService, UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
