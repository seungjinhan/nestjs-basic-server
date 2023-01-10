import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { RedisvService } from '../c.redisv/redisv.service';
import { RedisModule } from '@nestjs-modules/ioredis';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: RedisvService,
          useClass: RedisModule,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('setSessoin and GetSession', () => {
  //   const res = service.setSession(3, 'token');

  //   const resGet = service.getSessionByUserId(3);

  //   expect(res).toBe(resGet);
  // });
});
