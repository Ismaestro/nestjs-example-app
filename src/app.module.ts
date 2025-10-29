import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { UserModule } from './features/user/user.module';
import { HealthModule } from './features/health/health.module';
import { AppConfigModule } from './features/app-config/app-config.module';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { GoogleAnalyticsModule } from './features/google-analytics/google-analytics.module';
import { PokemonModule } from './features/pokemon/pokemon.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    AuthenticationModule,
    UserModule,
    PokemonModule,
    GoogleAnalyticsModule,
  ],
})
export class AppModule {}
