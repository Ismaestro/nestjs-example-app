import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AppConfigModule } from '../app-config/app-config.module';
import { PassportModule } from '@nestjs/passport';
import { AppConfigService } from '../app-config/app-config.service';
import { LanguageService } from '../../core/services/language.service';
import { UserRepository } from './user.repository';
import { HeaderService } from '../../core/services/header.service';

@Module({
  imports: [
    AppConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (appConfigService: AppConfigService) => ({
        secret: appConfigService.jwtAccessSecret,
        signOptions: {
          expiresIn: appConfigService.jwtAccessExpiresIn,
        },
      }),
      inject: [AppConfigService],
      imports: [AppConfigModule],
    }),
  ],
  providers: [JwtService, LanguageService, HeaderService, UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
