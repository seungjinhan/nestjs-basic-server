import { Module } from '@nestjs/common';

import { CacheModule } from '@config/cache/cache.module';

import { SessionController } from '@src/session/session.controller';
import { SessionService } from '@src/session/session.service';
import { RedisvModule } from '@src/redisv/redisv.module';

@Module({
  imports: [CacheModule, RedisvModule],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
