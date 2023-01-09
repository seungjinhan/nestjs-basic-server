import { Module } from '@nestjs/common';

import { CacheModule } from '@config/cache/cache.module';

import { SessionController } from '@src/c.session/session.controller';
import { SessionService } from '@src/c.session/session.service';
import { RedisvModule } from '@src/c.redisv/redisv.module';

@Module({
  imports: [CacheModule, RedisvModule],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
