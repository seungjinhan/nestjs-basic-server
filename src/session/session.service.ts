import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisvService } from '../redisv/redisv.service';

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
  __makeKey = (userId) => {
    return `session.${userId}`;
  };

  /**
   * 세선저장하기
   * @param userId
   * @param token
   */
  setSession(userId: number, token: string) {
    const map = new Map<string, string>([[`${this.__makeKey(userId)}`, token]]);
    this.redisService.setMap(this.SESSION, map);
  }

  /**
   * 세션불러오기
   * @param userId
   * @returns
   */
  getSession(userId: number) {
    return this.redisService.get({
      key: this.SESSION,
      type: 'MAP',
      mapKey: this.__makeKey(userId),
    });
  }

  /**
   * 세션지우기
   * @param userId
   * @returns
   */
  delSession(userId: number) {
    return this.redisService.delMap(this.SESSION, this.__makeKey(userId));
  }
}
