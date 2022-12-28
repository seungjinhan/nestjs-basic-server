import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('AuthInterceptor Before...');

    // console.log('-------');
    // console.log(context.switchToHttp().getRequest());
    // console.log('-------');
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(`AuthInterceptor After... ${Date.now() - now}ms`),
        ),
      );
  }
}
