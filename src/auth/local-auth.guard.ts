import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class EMAIL_PW_CHECK_GUARD extends AuthGuard('local') {}
