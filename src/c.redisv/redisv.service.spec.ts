import { Test, TestingModule } from '@nestjs/testing';
import { RedisvService } from './redisv.service';
import { Redis } from 'ioredis';
import { RedisModule } from '@nestjs-modules/ioredis';

describe('RedisvService', () => {
  let service: RedisvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RedisvService,
          useValue: RedisModule,
        },
      ],
    }).compile();

    service = module.get<RedisvService>(RedisvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
