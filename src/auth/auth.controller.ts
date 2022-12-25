import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard, Public } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return req.user;
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('token')
  token(@Request() req) {
    return this.authService.getAccessToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }
}
