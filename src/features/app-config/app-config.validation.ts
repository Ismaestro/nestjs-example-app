import Joi from 'joi';
import { Environment } from '../../core/enums/environment.enum';
import { Language } from '../../core/enums/language.enum';

export const appConfigValidationSchema = Joi.object({
  ENVIRONMENT: Joi.string().valid(Environment.LOCALHOST, Environment.PRODUCTION).required(),
  APP_NAME: Joi.string().default('NestJS Example App'),
  APP_URL: Joi.string().default('http://localhost:3000'),
  PORT: Joi.number().default(3000),
  IS_CORS_ENABLED: Joi.boolean().default(true),
  DEFAULT_LANGUAGE: Joi.string().default(Language.EN_US),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
  BCRYPT_SALT_ROUNDS: Joi.number().default(10),
  IS_SWAGGER_ENABLED: Joi.boolean().default(true),
  SWAGGER_DESCRIPTION: Joi.string().default('NestJS example app API'),
  SWAGGER_VERSION: Joi.string().default('1.5'),
  SWAGGER_PATH: Joi.string().default('api'),
});
