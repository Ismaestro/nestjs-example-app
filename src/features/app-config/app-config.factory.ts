import { registerAs } from '@nestjs/config';

export default [
  registerAs('global', () => ({
    environment: process.env.ENVIRONMENT,
    name: process.env.APP_NAME,
    url: process.env.APP_URL,
    port: process.env.PORT,
    bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
  })),

  registerAs('jwt', () => ({
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  })),

  registerAs('swagger', () => ({
    isEnabled: process.env.IS_SWAGGER_ENABLED,
    description: process.env.SWAGGER_DESCRIPTION,
    version: process.env.SWAGGER_VERSION,
    path: process.env.SWAGGER_PATH,
  })),
];
