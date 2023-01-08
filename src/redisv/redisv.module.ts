import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

import { RedisvService } from './redisv.service';
import { RedisvController } from './redisv.controller';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          url: 'redis://localhost:6379',
        },
      }),
    }),
  ],
  controllers: [RedisvController],
  providers: [RedisvService],
  exports: [RedisvService],
})
export class RedisvModule {}
