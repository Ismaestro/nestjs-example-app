import { Injectable, OnModuleInit } from '@nestjs/common';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import * as fs from 'node:fs';

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

    // Write JSON to a temporary file
    const temporaryFilePath = '/tmp/service-account.json';
    fs.writeFileSync(temporaryFilePath, credentialsJson);

    this.analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: temporaryFilePath,
    });
  }

  async getRealtimeUsers(): Promise<number> {
    try {
      const [response] = await this.analyticsDataClient.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        minuteRanges: [
          {
            startMinutesAgo: 1,
          },
        ],
        metrics: [{ name: 'activeUsers' }],
      });

      return response?.rows?.[0]?.metricValues?.[0]?.value
        ? Number.parseInt(response.rows[0].metricValues[0].value, 10)
        : 0;
    } catch (error) {
      console.error('Error fetching real-time users:', error);
      throw error;
    }
  }
}
