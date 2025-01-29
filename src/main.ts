import type { LogLevel } from '@nestjs/common';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';
import { AppConfigService } from './features/app-config/app-config.service';
import { ExceptionsFilter } from './core/filters/exceptions.filter';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { Environment } from './core/enums/environment.enum';

// eslint-disable-next-line max-lines-per-function,max-statements
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const minimumLoggerLevels: LogLevel[] = ['log', 'error', 'warn'];

  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.ENVIRONMENT === Environment.PRODUCTION
        ? minimumLoggerLevels
        : [...minimumLoggerLevels, 'debug', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter),
    new ExceptionsFilter(httpAdapter),
  );

  const appConfigService = app.get(AppConfigService);
  app.use(
    helmet({
      contentSecurityPolicy:
        appConfigService.environment === (Environment.LOCALHOST as string) ? false : undefined,
    }),
  );

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:4200', 'https://angular-example-app.netlify.app'],
    credentials: true,
  });

  const API_VERSION = 'v1';
  app.setGlobalPrefix(API_VERSION);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableShutdownHooks();

  const ONE_MINUTE = 60 * 1000;
  const CONNECTIONS_LIMIT = 500;
  app.use(
    rateLimit({
      windowMs: ONE_MINUTE,
      limit: CONNECTIONS_LIMIT,
      skip: (request) => request.path.includes('analytics'),
    }),
  );

  app.use(compression());

  if (appConfigService.isSwaggerEnabled) {
    const options = new DocumentBuilder()
      .setTitle(appConfigService.name)
      .setDescription(appConfigService.swaggerDescription)
      .setVersion(appConfigService.swaggerVersion)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(appConfigService.swaggerPath, app, document);
  }

  const port = String(appConfigService.port);
  await app.listen(port);
  logger.log(`Application is listening on port ${port}`);
}

void bootstrap();
