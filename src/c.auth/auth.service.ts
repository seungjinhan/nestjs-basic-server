import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Role } from '@prisma/client';

import { UserService } from '../c.user/user.service';
import { UserEntity } from '../c.user/entities/user.entity';
import { PrismaService } from '../config/prisma/prisma.service';
import { SessionService } from '../c.session/session.service';
import { EmailLoginDto } from './dto/email-login.dto';
import { ExceptionCode } from '../libs/constants/exception_code';
import { CustomException } from 'src/libs/exceptions/custon.exception';
import { jwtConstants } from '../config/authentication/jwt_constants';
import { SnsJoinLoginDto } from './dto/sns-login.dto';
import { SnsTokenEntity } from './entities/sns-token-entity';
import { CreateUserDto } from 'src/c.user/dto/create-user.dto';
import { constatantNoPw } from '../c.user/user-constants';

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
   * DB에 토큰 저장
   * @param user
   * @param token
   */
  async __insertTokenInDB(user: UserEntity, token: string) {
    // 사용자의 이전 토큰을 조회
    const resToken = await this.prisma.token.findUnique({
      where: { id: user.id },
    });

    if (!resToken) {
      await this.prisma.token.upsert({
        where: {
          userId: user.id,
        },
        create: { userId: user.id, token: token },
        update: { token: token },
      });
    } else {
      await this.prisma.token.update({
        where: { id: resToken.id },
        data: { token: token },
      });
    }
  }

  /**
   * 토큰 검증
   * @param token
   * @returns
   */
  async checkToken(token: string) {
    return this.jwtService.verify(token, {
      secret: jwtConstants.secret,
    });
  }

  /**
   * SNS 로그인 처리 -> UserEntity 반환
   * @param snsLoginDto
   * @returns UserEntity
   */
  async snsLogin(snsLoginDto: SnsJoinLoginDto): Promise<UserEntity> {
    let errorCode;
    const user = await this.userService.findUserFromEmail(snsLoginDto.email);
    if (user === null) {
      errorCode = ExceptionCode.AUTH.NOT_EXIST_EMAIL;
    } else {
      const snsToken = await this.findSnsTokenByUserId(user.id);

      if (snsToken.token === snsLoginDto.token) {
        const userId: number = snsToken.userId;
        return this.userService.findUserByUserId(userId);
      } else {
        errorCode = ExceptionCode.AUTH.NOT_MATCH_TOKEN;
      }
    }

    throw new HttpException(errorCode, HttpStatus.BAD_REQUEST);
  }

  /**
   * 회원가입 처리
   * @param user
   * @returns
   */
  async emailJoin(user: CreateUserDto): Promise<UserEntity> {
    return await this.userService.create(user);
  }

  /**
   * SNS 회원가입 처리
   * @param snsJoinLoginDto
   * @returns
   */
  async snsJoin(snsJoinLoginDto: SnsJoinLoginDto): Promise<UserEntity> {
    const newUser: CreateUserDto = new CreateUserDto().set({
      email: snsJoinLoginDto.email,
      name: snsJoinLoginDto.email,
      password: constatantNoPw,
    });

    const res = await this.prisma.$transaction(async (prisma) => {
      const user = await this.userService.createForTransaction(newUser, prisma);

      const snsToken = new SnsTokenEntity();
      snsToken.token = snsJoinLoginDto.token;
      snsToken.userId = user.id;
      snsToken.type = snsJoinLoginDto.type;
      try {
        await prisma.snsToken.create({ data: snsToken });
      } catch {
        throw new HttpException(
          ExceptionCode.COMMON.WRONG_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }
      return user;
    });
    return res;
  }

  /**
   * userId로 토큰정보 조회
   * @param userId
   * @returns
   */
  async findSnsTokenByUserId(userId: number): Promise<SnsTokenEntity> {
    return await this.prisma.snsToken
      .findUniqueOrThrow({
        where: { userId },
      })
      .catch(() => {
        throw new HttpException(
          ExceptionCode.AUTH.NOT_EXIST_TOKEN,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  /**
   * 사용자 인증처리
   * @param email
   * @param pass
   * @returns
   */
  async validateUser(user: EmailLoginDto, roles: Role[]): Promise<UserEntity> {
    const _user: UserEntity = await this.userService.findOneByEmailAndRole(
      user,
      roles,
    );
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
      // JWT 토큰생성
      const token = this.jwtService.sign(payload, {
        expiresIn: process.env.SESSION_TIME,
      });

      // 토큰저장
      this.__insertTokenInDB(user, token);

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
   * 세션체크
   * @param sessionKey
   * @returns
   */
  async checkSession(sessionKey): Promise<any> {
    const token: any = await this.sessionService.getSessionBySessionKey(
      sessionKey,
    );

    return await this.checkToken(token);
  }

  /**
   * User Id로 토큰 찾기
   * @param userId
   * @returns
   */
  async findToken(userId: number): Promise<Token | undefined> {
    return await this.prisma.token.findUnique({ where: { userId } });
  }
}
