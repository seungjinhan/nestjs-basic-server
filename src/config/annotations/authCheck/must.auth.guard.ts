import {
  Injectable,
  ExecutionContext,
  CanActivate,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../authentication/jwt_constants';
import { HttpStatus } from '@nestjs/common';
import { MUST_AUTH_KEY } from './must.auth.decorator';

@Injectable()
export class MustAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const mustAuthRes = this.reflector.getAllAndOverride(MUST_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (mustAuthRes === undefined) {
      return true;
    }

    let token: string = context.switchToHttp().getRequest()
      .headers.authorization;
    token = token.replace('Bearer ', '');

    let res;
    try {
      res = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      context.switchToHttp().getRequest().user = res;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
