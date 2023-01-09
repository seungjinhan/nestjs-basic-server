import {
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { EmailPasswordCheckGuard } from '../config/guards/email.pw/email.pw-auth.guard';
import { UserEntity } from '../c.user/entities/user.entity';
import { TokenEntity } from './entities/auth.entity';
import { MUST_AUTH } from '../config/annotations/must.auth/must.auth.decorator';
import { makeResponse } from '../libs/utils/api';
import { CookieUtil } from '../libs/utils/session';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @No_JWT()
  // @UseGuards(EMAIL_PW_CHECK_GUARD)
  // @Post('login')
  // @ApiOperation({ summary: '이메일, 패스워드로 로그인하기' })
  // @ApiResponse({ status: 200, description: '로그인성공' })
  // @ApiCreatedResponse({ type: UserEntity })
  // login(@Request() req) {
  //   return req.user;
  // }

  @UseGuards(EmailPasswordCheckGuard)
  @ApiOperation({ summary: '이메일, 패스워드로 로그인하고 Access Token 받기' })
  @Post('token')
  async token(@Request() req, @Res({ passthrough: true }) res: Response) {
    const sessionKey = await this.authService.getSessionKey(req.user);

    CookieUtil.setSession({ res: res, value: sessionKey });

    return makeResponse(true);
  }

  @MUST_AUTH()
  @ApiOperation({ summary: '사용자 프로필 조회 (토큰필요)' })
  @ApiCreatedResponse({ type: UserEntity })
  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }

  @MUST_AUTH()
  @ApiOperation({ summary: '토큰 조회' })
  @ApiCreatedResponse({ type: TokenEntity })
  @Get('find_token')
  findToken(@Query('user_id', ParseIntPipe) userId: number) {
    return this.authService.findToken(userId);
  }
}
