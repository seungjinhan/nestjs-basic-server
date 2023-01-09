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
import { MUST_AUTH_KEY } from '../../annotations/must.auth/must.auth.decorator';
import { Role } from '@prisma/client';
import { CookieUtil } from '../../../libs/utils/session';
import { SessionService } from '../../../c.session/session.service';
import e from 'express';
import { StringUtil } from '../../../libs/utils/string';

@Injectable()
export class MustAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const mustAuthRes = this.reflector.getAllAndOverride<Role>(MUST_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 어노테이션이 없으면 누구나 호출가능
    if (mustAuthRes === undefined) {
      return true;
    }

    // let token: string = context.switchToHttp().getRequest()
    //   .headers.authorization;
    // token = token.replace('Bearer ', '');

    const key = CookieUtil.getSession({
      req: context.switchToHttp().getRequest(),
    });

    if (!StringUtil.isNotEmpty(key)) {
      throw new HttpException('key is null', HttpStatus.UNAUTHORIZED);
    }
    const token: any = await this.sessionService.getSessionBySessionKey(key);

    if (!StringUtil.isNotEmpty(token)) {
      throw new HttpException('Wrong session key', HttpStatus.UNAUTHORIZED);
    }
    const realToken: string = token.split('|')[1];

    let res;

    try {
      // 토큰에서 사용자 정보를 꺼낸다.
      res = this.jwtService.verify(realToken, {
        secret: jwtConstants.secret,
      });

      const userRole = res.role;
      let roleFailMessage = '';
      if (mustAuthRes === Role.ADMIN) {
        if (userRole === Role.USER) {
          roleFailMessage = 'Authorization Fail';
        }
      } else if (mustAuthRes === Role.SUPER) {
        if (userRole === Role.USER || userRole === Role.ADMIN) {
          roleFailMessage = 'Authorization Fail';
        }
      }

      if (roleFailMessage !== '') {
        throw new HttpException(roleFailMessage, HttpStatus.UNAUTHORIZED);
      } else {
        context.switchToHttp().getRequest().user = res;
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
