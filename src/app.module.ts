import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { UserModule } from './features/user/user.module';
import { HealthModule } from './features/health/health.module';
import { AppConfigModule } from './features/app-config/app-config.module';
import { AuthenticationModule } from './features/authentication/authentication.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    AuthenticationModule,
    UserModule,
  ],
})
export class AppModule {}
