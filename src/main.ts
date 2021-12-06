import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/app-config.service';
import * as helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const minimumLoggerLevels: LogLevel[] = ['log', 'error', 'warn'];

  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.ENVIRONMENT === 'prod'
        ? minimumLoggerLevels
        : minimumLoggerLevels.concat(['debug', 'verbose']),
  });
  const appConfig = app.get(AppConfigService);

  app.useGlobalPipes(new ValidationPipe());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.use(helmet({ contentSecurityPolicy: (appConfig.environment === 'localhost') ? false : undefined }));

  if (appConfig.corsEnabled) {
    app.enableCors();
  }

  if (appConfig.swaggerEnabled) {
    const options = new DocumentBuilder()
      .setTitle(appConfig.name)
      .setDescription(appConfig.swaggerDescription)
      .setVersion(appConfig.swaggerVersion)
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(appConfig.swaggerPath, app, document);
  }

  const port = process.env.PORT;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
