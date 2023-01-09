import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisvService } from '../redisv/redisv.service';
import Security from '@src/libs/utils/security';

@Injectable()
export class SessionService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly redisService: RedisvService,
  ) {}

  /**
   * 세션 레디스 키
   */
  SESSION = process.env.SESSION_KEY;

  /**
   * 레디스 세선의 키 만들기
   * @param userId
   * @returns
   */
  __makeKey = async (userId): Promise<string> => {
    return await new Security().makeKey(userId);
  };

  /**
   * 사용자아이디와 토큰으로 값 만들기
   * @param userId
   * @param token
   * @returns
   */
  __makeValue = (userId: number, token: string): string => `${userId}|${token}`;

  /**
   * 세선저장하기
   * @param userId
   * @param token
   * @returns 사용자 세션 키값
   */
  async setSession(userId: number, token: string): Promise<string> {
    const mapKey = await this.__makeKey(userId + '');

    const map = new Map<string, string>([
      [mapKey, this.__makeValue(userId, token)],
    ]);

    this.redisService.setMap(this.SESSION, map);

    return mapKey;
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
      mapKey: await this.__makeKey(userId),
    });
  }

  /**
   * 세션키로 조회
   * @param sessionKey
   * @returns
   */
  async getSessionBySessionKey(sessionKey: string) {
    return await this.redisService.get({
      key: this.SESSION,
      type: 'MAP',
      mapKey: sessionKey,
    });
  }

  /**
   * 세션지우기
   * @param userId
   * @returns
   */
  async delSession(userId: number) {
    return this.redisService.delMap(this.SESSION, await this.__makeKey(userId));
  }
}
