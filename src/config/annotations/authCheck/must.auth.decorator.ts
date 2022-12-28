import { SetMetadata } from '@nestjs/common';

export const MUST_AUTH_KEY = 'MUST_AUTH_KEY';
export const MUST_AUTH = () => SetMetadata(MUST_AUTH_KEY, true);
