import { Test, TestingModule } from '@nestjs/testing';
import { RedisvService } from './redisv.service';

describe('RedisvService', () => {
  let service: RedisvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisvService],
    }).compile();

    service = module.get<RedisvService>(RedisvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
