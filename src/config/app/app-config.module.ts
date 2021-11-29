import * as Joi from 'joi';
import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import appConfiguration from './app-configuration';
import {AppConfigService} from './app-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfiguration],
      validationSchema: Joi.object({
        ENVIRONMENT: Joi.string().valid('localhost', 'prod').required(),
        APP_NAME: Joi.string().default('NestJS Example App'),
        APP_URL: Joi.string().default('http://localhost:3000'),
        APP_PORT: Joi.number().default(3000),
        APP_CORS_ENABLED: Joi.boolean().default(true),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        JWT_REFRESH_IN: Joi.string().required(),
        BCRYPT_SALT_ROUNDS: Joi.number().default(10),
        GRAPHQL_PLAYGROUND_ENABLED: Joi.boolean().default(true),
        GRAPHQL_DEBUG: Joi.boolean().default(true),
        GRAPHQL_SCHEMA_DESTINATION: Joi.string().default('schema.graphql'),
        GRAPHQL_SORT_SCHEMA: Joi.boolean().default(true),
        SWAGGER_ENABLED: Joi.boolean().default(true),
        SWAGGER_DESCRIPTION: Joi.string().default('NestJS example app API'),
        SWAGGER_VERSION: Joi.string().default('1.5'),
        SWAGGER_PATH: Joi.string().default('api'),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {
}
