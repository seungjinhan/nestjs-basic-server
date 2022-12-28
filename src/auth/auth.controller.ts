import {
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailPasswordCheckGuard } from '@src/config/authentication/local-auth.guard';
import { UserEntity } from '../user/entities/user.entity';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { TokenEntity } from './entities/auth.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MUST_AUTH } from '@config/annotations/authCheck/must.auth.decorator';

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
  @Post('token')
  @ApiOperation({ summary: '이메일, 패스워드로 로그인하고 Access Token 받기' })
  @ApiResponse({ status: 200, description: '로그인성공' })
  token(@Request() req) {
    return this.authService.getAccessToken(req.user);
  }

  @MUST_AUTH()
  @Get('profile')
  @ApiOperation({ summary: '사용자 프로필 조회 (토큰필요)' })
  @ApiResponse({ status: 200, description: '조회성공' })
  @ApiCreatedResponse({ type: UserEntity })
  profile(@Request() req) {
    console.log(req);
    return req.user;
  }

  @MUST_AUTH()
  @Get('find_token')
  @ApiOperation({ summary: '토큰 조회' })
  @ApiResponse({ status: 200, description: '조회성공' })
  @ApiCreatedResponse({ type: TokenEntity })
  findToken(@Query('user_id', ParseIntPipe) userId: number) {
    return this.authService.findToken(userId);
  }
}
