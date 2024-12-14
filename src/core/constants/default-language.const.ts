import { Language as PrismaLanguage } from '@prisma/client';
import { Language as AppLanguage } from '../enums/language.enum';

export const DEFAULT_PRISMA_LANGUAGE = PrismaLanguage.EN_US;
export const DEFAULT_APP_LANGUAGE = AppLanguage.EN_US;
