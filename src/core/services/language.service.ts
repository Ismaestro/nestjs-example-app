import { Injectable } from '@nestjs/common';
import { Language as PrismaLanguage } from '@prisma/client';
import { Language as AppLanguage } from '../enums/language.enum';
import { DEFAULT_APP_LANGUAGE, DEFAULT_PRISMA_LANGUAGE } from '../constants/default-language.const';

@Injectable()
export class LanguageService {
  parseAcceptLanguage(acceptLanguage: string): PrismaLanguage {
    if (!acceptLanguage) {
      return DEFAULT_PRISMA_LANGUAGE;
    }

    const supportedLanguages = Object.values(PrismaLanguage);
    const languages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase());

    for (const lang of languages) {
      const normalizedLang = lang.replace('-', '_').toUpperCase();
      if (supportedLanguages.includes(normalizedLang as PrismaLanguage)) {
        return normalizedLang as PrismaLanguage;
      }
    }

    return DEFAULT_PRISMA_LANGUAGE;
  }

  convertAppLanguage(language: AppLanguage): PrismaLanguage {
    switch (language) {
      case AppLanguage.ES_ES: {
        return PrismaLanguage.ES_ES;
      }
      case AppLanguage.EN_US: {
        return PrismaLanguage.EN_US;
      }
      default: {
        return DEFAULT_PRISMA_LANGUAGE;
      }
    }
  }

  convertPrismaLanguage(language: PrismaLanguage): AppLanguage {
    switch (language) {
      case PrismaLanguage.ES_ES: {
        return AppLanguage.ES_ES;
      }
      case PrismaLanguage.EN_US: {
        return AppLanguage.EN_US;
      }
      default: {
        return DEFAULT_APP_LANGUAGE;
      }
    }
  }

  transformLanguageRecursively(object: unknown): void {
    if (Array.isArray(object)) {
      this.transformArray(object);
      return;
    }

    if (typeof object === 'object' && object !== null) {
      this.transformObject(object as Record<string, unknown>);
    }
  }

  private transformArray(array: unknown[]): void {
    for (const item of array) {
      this.transformLanguageRecursively(item);
    }
  }

  private transformObject(object: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(object)) {
      if (Object.values(PrismaLanguage).includes(value as PrismaLanguage)) {
        object[key] = this.convertPrismaLanguage(value as PrismaLanguage);
      }
      this.transformLanguageRecursively(value);
    }
  }
}
