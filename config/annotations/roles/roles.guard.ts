import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';
import { HttpException } from '@nestjs/common';
import { EXCEPTION_MESSAGE } from '../../exceptions/message';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const res = requiredRoles.some((role) => user.roles?.includes(role));
    if (res === false) {
      throw new HttpException(
        EXCEPTION_MESSAGE.WRONG_ROLE,
        HttpStatus.FORBIDDEN,
      );
    }
    return res;
  }
}
