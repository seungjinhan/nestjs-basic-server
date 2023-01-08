import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class SessionService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  makeKey = (userId) => {
    return `session.${userId}`;
  };

  set(userId: number, token: string) {
    this.cache.set(this.makeKey(userId), token);
  }

  get(userId: number) {
    return this.cache.get(this.makeKey(userId));
  }

  del(userId: number) {
    this.cache.del(this.makeKey(userId));
  }
}
