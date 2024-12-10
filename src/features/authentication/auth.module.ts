import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfigModule } from '../app-config/app-config.module';
import { AppConfigService } from '../app-config/app-config.service';

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
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
