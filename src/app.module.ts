import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './features/authentication/auth.module';
import { UserModule } from './features/user/user.module';
import { HealthModule } from './features/health/health.module';
import { AppConfigModule } from './features/app-config/app-config.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
