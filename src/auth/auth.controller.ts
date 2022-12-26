import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EMAIL_PW_CHECK_GUARD } from './local-auth.guard';
import { No_JWT } from '../../config/annotations/no_jwt/no.jwt.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @No_JWT()
  @UseGuards(EMAIL_PW_CHECK_GUARD)
  @Post('login')
  login(@Request() req) {
    return req.user;
  }

  @No_JWT()
  @UseGuards(EMAIL_PW_CHECK_GUARD)
  @Post('token')
  token(@Request() req) {
    return this.authService.getAccessToken(req.user);
  }

  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }
}
