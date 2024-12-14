import Joi from 'joi';
import { Environment } from '../../core/enums/environment.enum';

export const appConfigValidationSchema = Joi.object({
  ENVIRONMENT: Joi.string().valid(Environment.LOCALHOST, Environment.PRODUCTION).required(),
  APP_NAME: Joi.string().default('NestJS Example App'),
  APP_URL: Joi.string().default('https://nestjs-example-app.fly.dev'),
  PORT: Joi.number().default(3000),
  BCRYPT_SALT_ROUNDS: Joi.number().default(10),
  FRONT_DOMAIN: Joi.string().default('https://angular-example-app.netlify.app'),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
  IS_SWAGGER_ENABLED: Joi.boolean().default(true),
  SWAGGER_DESCRIPTION: Joi.string().default('NestJS example app API'),
  SWAGGER_VERSION: Joi.string().default('1.5'),
  SWAGGER_PATH: Joi.string().default('api'),
});
