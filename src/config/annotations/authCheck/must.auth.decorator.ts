import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const MUST_AUTH_KEY = 'MUST_AUTH_KEY';
export const MUST_AUTH = (role: Role = Role.USER) =>
  SetMetadata(MUST_AUTH_KEY, role);
