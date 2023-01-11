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
import { APIReturnType, makeResponse } from '../libs/utils/api';
import { CookieUtil } from '../libs/utils/session';
import { EmailLoginDto } from './dto/email-login.dto';
import { Role } from '@prisma/client';
import { UserResponseDto } from '../c.user/dto/user-response.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  __login = async (
    user: EmailLoginDto,
    res: Response,
  ): Promise<APIReturnType> => {
    // 사용자 확인
    const dbUser: UserEntity = await this.authService.validateUser(user);

    // 토큰 생성
    const token = await this.authService.createToken(dbUser);

    // 세션 새성
    const userSessionKey = await this.authService.getSessionKeyAfterSaveSession(
      dbUser.id,
      token,
    );

    // 쿠키에 세셩키값 저장
    CookieUtil.setSession({ res: res, value: userSessionKey });

    const resUser: UserResponseDto = new UserResponseDto();
    resUser.covertFromEntity(dbUser);

    return makeResponse(true, resUser);
  };

  /**
   * 관리자 로그인
   * @param user
   * @param res
   * @returns
   */
  @ApiOperation({
    summary: '관리자, 이메일, 패스워드로 로그인하고 Access Token 받기',
  })
  @Post('/admin')
  async admin(
    @Body() user: EmailLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<APIReturnType> {
    user.role = Role.ADMIN;
    return this.__login(user, res);
  }

  /**
   * 사용자 로그인
   * @param user
   * @param res
   * @returns
   */
  @ApiOperation({ summary: '이메일, 패스워드로 로그인하고 Access Token 받기' })
  @Post()
  async login(
    @Body() user: EmailLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<APIReturnType> {
    return this.__login(user, res);
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
