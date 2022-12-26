import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { No_JWT_KEY } from './no.jwt.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isNoJWT = this.reflector.getAllAndOverride<boolean>(No_JWT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isNoJWT) {
      return true;
    }

    return super.canActivate(context);
  }
}
