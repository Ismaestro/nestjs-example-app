import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { AppConfigModule } from './config/app/app-config.module';
import { AppConfigService } from './config/app/app-config.service';
import { AuthModule } from './authentication/auth.module';
import { UserModule } from './models/user/user.module';
import { PostModule } from './models/post/post.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    AppConfigModule,
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
    PostModule,
  ],
  providers: [],
})
export class AppModule {}
