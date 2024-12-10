import { Module } from '@nestjs/common';
import { ConfigModule as NestJsCConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import appConfigurationFactory from './app-config.factory';
import { appConfigValidationSchema } from './app-config.validation';

@Module({
  imports: [
    NestJsCConfigModule.forRoot({
      load: appConfigurationFactory,
      validationSchema: appConfigValidationSchema,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
