import { SetMetadata } from '@nestjs/common';

export const No_JWT_KEY = 'No_JWT_KEY';
export const No_JWT = () => SetMetadata(No_JWT_KEY, true);
