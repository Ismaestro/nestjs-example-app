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

  const FIFTEEN_MINUTES = 15 * 60 * 1000;
  const CONNECTIONS_LIMIT = 100;
  app.use(
    rateLimit({
      windowMs: FIFTEEN_MINUTES,
      limit: CONNECTIONS_LIMIT,
    }),
  );

  app.use(compression());

  if (appConfigService.isCorsEnabled) {
    app.enableCors();
  }

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

  app.setGlobalPrefix('v1');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableShutdownHooks();

  const port = String(appConfigService.port);
  await app.listen(port);
  logger.log(`Application is listening on port ${port}`);
}

void bootstrap();
