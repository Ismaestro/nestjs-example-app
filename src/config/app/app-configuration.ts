import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.ENVIRONMENT,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  port: process.env.APP_PORT,
  corsEnabled: process.env.APP_CORS_ENABLED,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtRefreshIn: process.env.JWT_REFRESH_IN,
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
  graphqlPlaygroundEnabled: process.env.GRAPHQL_PLAYGROUND_ENABLED,
  graphqlDebug: process.env.GRAPHQL_DEBUG,
  graphqlSchemaDestination: process.env.GRAPHQL_SCHEMA_DESTINATION,
  graphqlSortSchema: process.env.GRAPHQL_SORT_SCHEMA,
  swaggerEnabled: process.env.SWAGGER_ENABLED,
  swaggerDescription: process.env.SWAGGER_DESCRIPTION,
  swaggerVersion: process.env.SWAGGER_VERSION,
  swaggerPath: process.env.SWAGGER_PATH,
}));
