import { Module } from '@nestjs/common';
import { RedisvModule } from 'src/c.redisv/redisv.module';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { RedisvService } from 'src/c.redisv/redisv.service';

@Module({
  imports: [RedisvModule],
  controllers: [SessionController],
  providers: [SessionService, RedisvService],
  exports: [SessionService],
})
export class SessionModule {}
