import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { No_JWT } from '@config/annotations/no_jwt/no.jwt.decorator';
import { EMAIL_PW_CHECK_GUARD } from '@config/authentication/local-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @No_JWT()
  @UseGuards(EMAIL_PW_CHECK_GUARD)
  @Post('login')
  @ApiOperation({ summary: '이메일, 패스워드로 로그인하기' })
  @ApiResponse({ status: 200, description: '로그인성공' })
  login(@Request() req) {
    return req.user;
  }

  @No_JWT()
  @UseGuards(EMAIL_PW_CHECK_GUARD)
  @Post('token')
  @ApiOperation({ summary: '이메일, 패스워드로 로그인하고 Access Token 받기' })
  @ApiResponse({ status: 200, description: '로그인성공' })
  token(@Request() req) {
    return this.authService.getAccessToken(req.user);
  }

  @Get('profile')
  @ApiOperation({ summary: '사용자 프로필 조회 (토큰필요)' })
  @ApiResponse({ status: 200, description: '조회성공' })
  profile(@Request() req) {
    return req.user;
  }
}
