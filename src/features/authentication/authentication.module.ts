import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AppConfigModule } from '../app-config/app-config.module';
import { PassportModule } from '@nestjs/passport';
import { AppConfigService } from '../app-config/app-config.service';
import { LanguageService } from '../../core/services/language.service';
import { DateService } from '../../core/services/date.service';
import { UserRepository } from '../user/user.repository';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './services/authentication.service';
import { TokenService } from './services/token.service';

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
  providers: [
    JwtService,
    TokenService,
    LanguageService,
    DateService,
    AuthenticationService,
    UserRepository,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
