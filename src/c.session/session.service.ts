import { Injectable } from '@nestjs/common';
import { RedisvService } from '../c.redisv/redisv.service';
import { Security } from '../libs/utils/security';

interface SessionValueStructure {
  userId: number;
  token: string;
}

@Injectable()
export class SessionService {
  constructor(private readonly redisService: RedisvService) {}

  /**
   * 세션 레디스 키
   */
  SESSION = process.env.SESSION_KEY;

  /**
   * 레디스 세선의 키 만들기
   * @param userId
   * @returns
   */
  __makeSessionKey = async (userId): Promise<string> => {
    return await Security.makeKey(userId);
  };

  /**
   * 사용자아이디와 토큰으로 값 만들기
   * @param userId
   * @param token
   * @returns
   */
  makeTokenAndUserId = ({ userId, token }: SessionValueStructure): string =>
    `${userId}|${token}`;

  /**
   * 세션값에서 userId, token 나누기
   * @param value
   * @returns
   */
  getTokenAndUserId = (value: string): SessionValueStructure => {
    const _data = value.split('|');
    return { userId: +_data[0], token: _data[1] };
  };

  /**
   * 세선저장하기
   * @param userId
   * @param token
   * @returns 사용자 세션 키값
   */
  async setSession(userId: number, token: string): Promise<string> {
    const userSessionKey = await this.__makeSessionKey(userId + '');

    const map = new Map<string, string>([
      [userSessionKey, this.makeTokenAndUserId({ userId, token })],
    ]);

    this.redisService.setMap(this.SESSION, map);

    return userSessionKey;
  }

  /**
   * 세션불러오기
   * @param userId
   * @returns
   */
  async getSessionByUserId(userId: number) {
    return this.redisService.get({
      key: this.SESSION,
      type: 'MAP',
      mapKey: await this.__makeSessionKey(userId),
    });
  }

  /**
   * 세션키로 조회
   * @param sessionKey
   * @returns
   */
  async getSessionBySessionKey(sessionKey: string) {
    const data: any = await this.redisService.get({
      key: this.SESSION,
      type: 'MAP',
      mapKey: sessionKey,
    });
    return this.getTokenAndUserId(data).token;
  }

  /**
   * 세션지우기
   * @param userId
   * @returns
   */
  async delSession(userId: number) {
    return this.redisService.delMap(
      this.SESSION,
      await this.__makeSessionKey(userId),
    );
  }
}
