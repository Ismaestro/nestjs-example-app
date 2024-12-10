import { Injectable } from '@nestjs/common';
import { Language } from '../../core/enums/language.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get environment(): string {
    return this.configService.get<string>('global.environment')!;
  }

  get name(): string {
    return this.configService.get<string>('global.name')!;
  }

  get url(): string {
    return this.configService.get<string>('global.url')!;
  }

  get port(): number {
    return Number(this.configService.get<number>('global.port'));
  }

  get isCorsEnabled(): boolean {
    return this.configService.get<boolean>('global.isCorsEnabled')!;
  }

  get defaultLanguage(): Language {
    return this.configService.get<Language>('global.defaultLanguage')!;
  }

  get bcryptSaltRounds(): number {
    return this.configService.get<number>('global.bcryptSaltRounds')!;
  }

  get jwtAccessSecret(): string {
    return this.configService.get<string>('jwt.accessSecret')!;
  }

  get jwtAccessExpiresIn(): string {
    return this.configService.get<string>('jwt.accessExpiresIn')!;
  }

  get jwtRefreshSecret(): string {
    return this.configService.get<string>('jwt.refreshSecret')!;
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.get<string>('jwt.refreshExpiresIn')!;
  }

  get isSwaggerEnabled(): boolean {
    return this.configService.get<boolean>('swagger.isEnabled')!;
  }

  get swaggerDescription(): string {
    return this.configService.get<string>('swagger.description')!;
  }

  get swaggerVersion(): string {
    return this.configService.get<string>('swagger.version')!;
  }

  get swaggerPath(): string {
    return this.configService.get<string>('swagger.path')!;
  }
}
