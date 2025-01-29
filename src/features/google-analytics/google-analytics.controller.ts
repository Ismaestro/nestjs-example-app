import { Controller, Get } from '@nestjs/common';
import { GoogleAnalyticsService } from '../../core/services/google-analytics.service';

@Controller('analytics')
export class GoogleAnalyticsController {
  constructor(private readonly googleAnalyticsService: GoogleAnalyticsService) {}

  @Get('realtime-users')
  async getRealtimeUsers() {
    const activeUsers = await this.googleAnalyticsService.getRealtimeUsers();
    return { activeUsers };
  }
}
