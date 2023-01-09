import { Test, TestingModule } from '@nestjs/testing';
import { RedisvController } from './redisv.controller';
import { RedisvService } from './redisv.service';

describe('RedisvController', () => {
  let controller: RedisvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedisvController],
      providers: [RedisvService],
    }).compile();

    controller = module.get<RedisvController>(RedisvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
