import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { CacheModule } from '@config/cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
