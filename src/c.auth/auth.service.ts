import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../c.user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../c.user/entities/user.entity';
import { PrismaService } from '../config/prisma/prisma.service';
import { SessionService } from '../c.session/session.service';
import { EmailLoginDto } from './dto/email-login.dto';
import { ExceptionCode } from '../libs/constants/exception_code';
import { CustomException } from 'src/libs/exceptions/custon.exception';

export type Token = any;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 사용자 인증처리
   * @param email
   * @param pass
   * @returns
   */
  async validateUser(user: EmailLoginDto): Promise<UserEntity> {
    const _user: UserEntity = await this.userService.findOneByEmail(user);
    if (_user == null) {
      throw new HttpException(
        ExceptionCode.AUTH.NOT_EXIST_EMAIL,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (_user && _user.password === user.password) {
      _user.password = '';
      return _user;
    }
    throw new HttpException(
      ExceptionCode.AUTH.WRONG_PASSWORD,
      HttpStatus.BAD_REQUEST,
    );
  }

  /**
   * 토큰 생성
   * @param user
   * @returns
   */
  async createToken(user: UserEntity): Promise<string> {
    const payload = { email: user.email, id: user.id, role: user.role };
    try {
      const token = this.jwtService.sign(payload, {
        expiresIn: process.env.SESSION_TIME,
      });
      this.__insertToken(user, token);

      return token;
    } catch (error) {
      throw new CustomException(
        ExceptionCode.AUTH.TOKEN_FAIL,
        error.message,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // DB에 토큰 저장
  }

  /**
   * 세션키가져오기
   * @param userId
   * @param token
   * @returns
   */
  async getSessionKeyAfterSaveSession(userId, token): Promise<string> {
    // 세션에 저장
    const userSessionKey = await this.sessionService.setSession(userId, token);
    return userSessionKey;
  }

  /**
   * User Id로 토큰 찾기
   * @param userId
   * @returns
   */
  async findToken(userId: number): Promise<Token | undefined> {
    return await this.prisma.token.findUnique({ where: { userId } });
  }

  /**
   * DB에 토큰 저장
   * @param user
   * @param token
   */
  async __insertToken(user: UserEntity, token: string) {
    const resToken = await this.prisma.token.findUnique({
      where: { id: user.id },
    });
    if (!resToken) {
      await this.prisma.token.create({
        data: { userId: user.id, token: token },
      });
    } else {
      await this.prisma.token.update({
        where: { id: resToken.id },
        data: { token: token },
      });
    }
  }
}
