import { Logger, Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { AppConfigModule } from './config/app/app-config.module';
import { AppConfigService } from './config/app/app-config.service';
import { AuthModule } from './authentication/auth.module';
import { UserModule } from './models/user/user.module';
import { SharedModule } from './shared/shared.module';
import { GraphQLError } from 'graphql';
import { GraphQLModule } from '@nestjs/graphql';
import { HealthModule } from './health/health.module';
import { HeroModule } from './models/hero/hero.module';
import path from 'path';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

@Module({
  imports: [
    HealthModule,
    AppConfigModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
      },
      resolvers: [
        new QueryResolver(['lang']),
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
    }),
    GraphQLModule.forRootAsync({
      useFactory: async (appConfig: AppConfigService) => ({
        installSubscriptionHandlers: true,
        buildSchemaOptions: {
          numberScalarMode: 'integer',
        },
        sortSchema: appConfig.graphqlSortSchema,
        autoSchemaFile: appConfig.graphqlSchemaDestination,
        debug: appConfig.graphqlDebug,
        playground: appConfig.graphqlPlaygroundEnabled,
        context: ({ req }) => ({ req }),
        formatError: (error: GraphQLError) => {
          const exception = error.extensions?.exception?.response;
          const logger = new Logger('GraphQLError');
          logger.error(JSON.stringify(error));

          return {
            message: exception?.message || error.message || 'INTERNAL_SERVER_ERROR',
            code: exception?.code || error.extensions?.response?.statusCode || 500,
            data: exception?.data || {},
            info: exception?.code || error.extensions?.response?.message || '',
          };
        },
      }),
      inject: [AppConfigService],
      imports: [AppConfigModule],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    AuthModule,
    UserModule,
    HeroModule,
  ],
  providers: [],
})
export class AppModule {}
