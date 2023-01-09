import { Test, TestingModule } from '@nestjs/testing';
import { RedisvController } from './redisv.controller';
import { RedisvService } from './redisv.service';
import { RedisModule } from '@nestjs-modules/ioredis';

describe('RedisvController', () => {
  let controller: RedisvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedisvController],
      providers: [
        {
          provide: RedisvService,
          useClass: RedisModule,
        },
      ],
    }).compile();

    controller = module.get<RedisvController>(RedisvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
