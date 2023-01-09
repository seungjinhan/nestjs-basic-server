import { Test, TestingModule } from '@nestjs/testing';
import { RedisvService } from '../c.redisv/redisv.service';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { RedisModule } from '@nestjs-modules/ioredis';

describe('SessionController', () => {
  let controller: SessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        SessionService,
        {
          provide: RedisvService,
          useClass: RedisModule,
        },
      ],
    }).compile();

    controller = module.get<SessionController>(SessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
