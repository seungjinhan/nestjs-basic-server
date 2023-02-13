import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { UserEntity } from '../c.user/entities/user.entity';
import { TokenEntity } from './entities/token.entity';
import { MUST_AUTH } from '../config/annotations/must.auth/must.auth.decorator';
import { APIReturnType, makeResponse } from '../libs/utils/api';
import { CookieUtil } from '../libs/utils/session';
import { EmailLoginDto } from './dto/email-login.dto';
import { Role } from '@prisma/client';
import { UserResponseDto } from '../c.user/dto/user-response.dto';
import { Request } from 'express';
import { LoginResponseDto } from './dto/login-response';
import { SnsJoinLoginDto } from './dto/sns-login.dto';
import { PrismaService } from '../config/prisma/prisma.service';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 인증확인
   * @param req
   */
  _checkAuth = async (req: Request) => {
    const sessionKey = CookieUtil.getSessionKey({ req: req });
    await this.authService.checkSession(sessionKey);
  };

  /**
   * UserEntity를 받아서 토큰생성 -> SessionKey만들어서 호출 반환 객체 만들어서 반환
   * @param dbUser
   * @returns
   */
  async __makeResponseAfterSessionKey(
    dbUser: UserEntity,
  ): Promise<APIReturnType> {
    // 토큰 생성
    const token = await this.authService.createToken(dbUser);

    // 세션 새성
    const sesstionKey = await this.authService.getSessionKeyAfterSaveSession(
      dbUser.id,
      token,
    );

    const resLogin: LoginResponseDto = new LoginResponseDto();
    resLogin.email = dbUser.email;
    resLogin.userId = dbUser.id;
    resLogin.sessionKey = sesstionKey;

    return makeResponse(true, resLogin);
  }

  /**
   * SNS 로그인 처리
   * @param snsLoginUser
   * @returns
   */
  async __snsLogin(snsLoginUser: SnsJoinLoginDto): Promise<APIReturnType> {
    const dbUser: UserEntity = await this.authService.snsLogin(snsLoginUser);
    return await this.__makeResponseAfterSessionKey(dbUser);
  }

  /**
   * SNS회원가입
   * @param snsJoinUserDto
   * @returns
   */
  async __snsJoin(snsJoinUserDto: SnsJoinLoginDto): Promise<APIReturnType> {
    const userEntity = await this.authService.snsJoin(snsJoinUserDto);
    return makeResponse(true, userEntity.id);
  }

  /**
   * 로그인처리
   * @param user
   * @param res
   * @returns
   */
  async __emailLogin(
    user: EmailLoginDto,
    roles: Role[],
  ): Promise<APIReturnType> {
    // 사용자 확인
    const dbUser: UserEntity = await this.authService.validateUser(user, roles);
    return await this.__makeResponseAfterSessionKey(dbUser);
  }

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
  async admin(@Body() user: EmailLoginDto): Promise<APIReturnType> {
    return this.__emailLogin(user, [Role.ADMIN, Role.SUPER]);
  }

  /**
   * @returns
   */
  @MUST_AUTH(Role.ADMIN)
  @ApiOperation({
    summary: '관리자, 이메일, 패스워드로 로그인하고 Access Token 받기',
  })
  @Get('/is_admin')
  async isAdmin() {
    return makeResponse(true);
  }

  /**
   * 사용자 로그인
   * @param user
   * @param res
   * @returns
   */
  @ApiOperation({ summary: '이메일, 패스워드로 로그인하고 Access Token 받기' })
  @Post('/login/email')
  async emailLogin(@Body() user: EmailLoginDto): Promise<APIReturnType> {
    return this.__emailLogin(user, [Role.USER]);
  }

  /**
   * SNS 로그인
   * @param loginInfo
   * @returns
   */
  @ApiOperation({ summary: 'SNS 로그인하고 Access Token 받기' })
  @Post('/login/sns')
  async snsLogin(@Body() loginInfo: SnsJoinLoginDto): Promise<APIReturnType> {
    return this.__snsLogin(loginInfo);
  }

  /**
   *
   * @param loginInfo
   * @returns
   */
  @ApiOperation({ summary: 'SNS 회원가입' })
  @Post('/join/sns')
  async snsJoin(@Body() loginInfo: SnsJoinLoginDto): Promise<APIReturnType> {
    return this.__snsJoin(loginInfo);
  }

  /**
   * @param req
   * @returns
   */
  @MUST_AUTH()
  @ApiOperation({ summary: '사용자 프로필 조회 (토큰필요)' })
  @ApiCreatedResponse({ type: UserEntity })
  @Get('profile')
  profile(@Req() req: Request) {
    return makeResponse(true, req.user);
  }

  /**
   *
   * @param userId
   * @returns
   */
  @MUST_AUTH()
  @ApiOperation({ summary: '토큰 조회' })
  @ApiCreatedResponse({ type: TokenEntity })
  @Get('find_token')
  findToken(@Query('user_id', ParseIntPipe) userId: number) {
    const token = this.authService.findToken(userId);
    return makeResponse(true, token);
  }
}
