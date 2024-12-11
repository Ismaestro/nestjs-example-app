import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, { data: T; ok: boolean }> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<{ data: T; ok: boolean }> {
    return next.handle().pipe(
      map((data) => {
        const status = context.switchToHttp().getResponse().statusCode;
        const ok = status >= 200 && status < 300;
        return { data, ok };
      }),
    );
  }
}
