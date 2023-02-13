import {
  Injectable,
  ExecutionContext,
  CanActivate,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpStatus } from '@nestjs/common';
import { MUST_AUTH_KEY } from '../../annotations/must.auth/must.auth.decorator';
import { Role } from '@prisma/client';
import { CookieUtil } from '../../../libs/utils/session';
import { SessionService } from '../../../c.session/session.service';
import { StringUtil } from '../../../libs/utils/string';
import { AuthService } from '../../../c.auth/auth.service';
import { ExceptionCode } from '../../../libs/constants/exception_code';

@Injectable()
export class MustAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
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

    const headers = context.switchToHttp().getRequest().headers;

    let sessionKey: string = headers.authorization;

    if (!StringUtil.isNotEmpty(sessionKey)) {
      throw new HttpException(
        ExceptionCode.AUTH.NO_SESSION_KEY,
        HttpStatus.UNAUTHORIZED,
      );
    }

    sessionKey = sessionKey.replace('Bearer ', '');
    // 쿠키에서 사용자 세션키를 조회
    // const key = CookieUtil.getSessionKey({
    //   req: context.switchToHttp().getRequest(),
    // });

    const realToken: any = await this.sessionService.getSessionBySessionKey(
      sessionKey,
    );

    if (realToken === null || !StringUtil.isNotEmpty(realToken)) {
      throw new HttpException(
        ExceptionCode.AUTH.WRONG_SESSION_KEY,
        HttpStatus.UNAUTHORIZED,
      );
    }

    let res;

    try {
      // 토큰에서 사용자 정보를 꺼낸다.
      res = await this.authService.checkToken(realToken);

      const userRole = res['role'];
      let roleFailMessage = '';

      console.log(mustAuthRes, userRole);
      // API설정이 ADMIN
      if (mustAuthRes === Role.ADMIN) {
        // 현재 사용자가 USER
        if (userRole === Role.USER) {
          roleFailMessage = 'Authorization Fail';
        }
        // API설정이 SUPER
      } else if (mustAuthRes === Role.SUPER) {
        // 현재 사용자가 USER, ADMIN
        if (userRole === Role.USER || userRole === Role.ADMIN) {
          roleFailMessage = 'Authorization Fail';
        }
      }

      console.log(roleFailMessage);

      if (roleFailMessage !== '') {
        throw new HttpException(roleFailMessage, HttpStatus.UNAUTHORIZED);
        return;
      } else {
        context.switchToHttp().getRequest().user = await res;
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
