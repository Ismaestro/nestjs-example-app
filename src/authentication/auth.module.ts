import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AppConfigService } from '../config/app/app-config.service';
import { AppConfigModule } from '../config/app/app-config.module';
import { GraphqlAuthGuard } from './graphql-auth.guard';

@Module({
  imports: [
    AppConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (appConfig: AppConfigService) => ({
        secret: appConfig.jwtAccessSecret,
        signOptions: {
          expiresIn: appConfig.jwtExpiresIn,
        },
      }),
      inject: [AppConfigService],
      imports: [AppConfigModule],
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, GraphqlAuthGuard],
  exports: [GraphqlAuthGuard, AuthService],
})
export class AuthModule {}
