import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  convertToMilliseconds(duration: string) {
    const match = /^(?<temp2>\d+)(?<temp1>[A-Za-z]+)$/u.exec(duration);

    if (!match) {
      throw new Error('Invalid duration format');
    }

    const value = Number.parseInt(match[1], 10);
    const unit = match[2].toLowerCase() as 'd' | 'h' | 'm' | 's';

    /* eslint-disable id-length */
    const timeUnits = {
      d: 86_400_000, // 1 day = 86400000 milliseconds
      h: 3_600_000, // 1 hour = 3600000 milliseconds
      m: 60_000, // 1 minute = 60000 milliseconds
      s: 1000, // 1 second = 1000 milliseconds
    };

    if (!timeUnits[unit]) {
      throw new Error('Unsupported time unit');
    }

    return value * timeUnits[unit];
  }
}
