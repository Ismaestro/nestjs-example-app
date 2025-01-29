import { Module } from '@nestjs/common';
import { GoogleAnalyticsController } from './google-analytics.controller';
import { GoogleAnalyticsService } from '../../core/services/google-analytics.service';

@Module({
  controllers: [GoogleAnalyticsController],
  providers: [GoogleAnalyticsService],
})
export class GoogleAnalyticsModule {}
