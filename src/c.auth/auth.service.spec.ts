import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';

import { AuthService } from './auth.service';
import { UserService } from '../c.user/user.service';
import { SessionService } from '../c.session/session.service';
import { PrismaService } from '../config/prisma/prisma.service';
import { RedisvService } from '../c.redisv/redisv.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        SessionService,
        PrismaService,
        JwtService,
        {
          provide: RedisvService,
          useClass: RedisModule,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
