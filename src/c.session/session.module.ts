import { Module } from '@nestjs/common';

import { SessionController } from '@src/c.session/session.controller';
import { SessionService } from '@src/c.session/session.service';
import { RedisvModule } from '@src/c.redisv/redisv.module';
import { RedisvService } from '@src/c.redisv/redisv.service';

@Module({
  imports: [RedisvModule],
  controllers: [SessionController],
  providers: [SessionService, RedisvService],
  exports: [SessionService],
})
export class SessionModule {}
