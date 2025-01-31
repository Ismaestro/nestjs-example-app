import { Injectable, OnModuleInit } from '@nestjs/common';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import * as fs from 'node:fs';
import { google } from '@google-analytics/data/build/protos/protos';
import IRunRealtimeReportResponse = google.analytics.data.v1beta.IRunRealtimeReportResponse;

@Injectable()
export class GoogleAnalyticsService implements OnModuleInit {
  private analyticsDataClient!: BetaAnalyticsDataClient;

  private readonly propertyId = '475483661';

  onModuleInit() {
    const credentialsBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
    if (!credentialsBase64) {
      throw new Error('Missing Google Analytics credentials');
    }
    const credentialsJson = Buffer.from(credentialsBase64, 'base64').toString('utf8');
    const temporaryFilePath = '/tmp/service-account.json';
    fs.writeFileSync(temporaryFilePath, credentialsJson);
    this.analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: temporaryFilePath,
    });
  }

  async getRealtimeUsers(): Promise<number> {
    const [response] = await this.analyticsDataClient.runRealtimeReport({
      property: `properties/${this.propertyId}`,
      minuteRanges: [{ startMinutesAgo: 5 }],
      metrics: [{ name: 'activeUsers' }],
    });

    return this.extractMetricValue(response);
  }

  // eslint-disable-next-line complexity
  private extractMetricValue(response: IRunRealtimeReportResponse): number {
    return Number.parseInt(response?.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
  }
}
