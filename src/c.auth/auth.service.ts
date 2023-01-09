import { Injectable } from '@nestjs/common';
import { UserService } from '../c.user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@src/c.user/entities/user.entity';
import { PrismaService } from '@src/config/prisma/prisma.service';
import { SessionService } from '@src/c.session/session.service';

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
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * access_token 생성하기
   * @param user
   * @returns sessionKey
   */
  async getSessionKey(user: UserEntity): Promise<string> {
    const payload = { email: user.email, id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    this.__insertToken(user, token);

    // 세션에 저장
    const sessionKey = await this.sessionService.setSession(user.id, token);

    return sessionKey;
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
