import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { LanguageService } from '../services/language.service';

@Injectable()
export class LanguageTransformInterceptor implements NestInterceptor {
  constructor(private readonly languageService: LanguageService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((response: Response) => {
        this.languageService.transformLanguageRecursively(response);
        return response;
      }),
    );
  }
}
