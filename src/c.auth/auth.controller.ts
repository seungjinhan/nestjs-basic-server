import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { UserEntity } from '../c.user/entities/user.entity';
import { TokenEntity } from './entities/token.entity';
import { MUST_AUTH } from '../config/annotations/must.auth/must.auth.decorator';
import { makeResponse } from '../libs/utils/api';
import { CookieUtil } from '../libs/utils/session';
import { LoginEmail } from './dto/login-email.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(EmailPasswordCheckGuard)
  @ApiOperation({ summary: '이메일, 패스워드로 로그인하고 Access Token 받기' })
  @Post()
  async login(
    @Body() user: LoginEmail,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 사용자 확인
    const dbUser: UserEntity = await this.authService.validateUser(user);
    console.log(dbUser);

    // 토큰 생성
    const token = await this.authService.createToken(dbUser);

    // 세션 새성
    const sessionKey = await this.authService.getSessionKeyAfterSaveSession(
      dbUser.id,
      token,
    );

    // 쿠키에 세셩키값 저장
    CookieUtil.setSession({ res: res, value: sessionKey });

    return makeResponse(true, dbUser);
  }

  @MUST_AUTH()
  @ApiOperation({ summary: '사용자 프로필 조회 (토큰필요)' })
  @ApiCreatedResponse({ type: UserEntity })
  @Get('profile')
  profile(@Request() req) {
    return makeResponse(true, req.user);
  }

  @MUST_AUTH()
  @ApiOperation({ summary: '토큰 조회' })
  @ApiCreatedResponse({ type: TokenEntity })
  @Get('find_token')
  findToken(@Query('user_id', ParseIntPipe) userId: number) {
    const token = this.authService.findToken(userId);
    return makeResponse(true, token);
  }
}
