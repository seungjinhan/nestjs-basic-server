import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionService } from '../c.session/session.service';
import { PrismaService } from '../config/prisma/prisma.service';
import { UserService } from '../c.user/user.service';
import { RedisvService } from '../c.redisv/redisv.service';
import { RedisModule } from '@nestjs-modules/ioredis';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        SessionService,
        PrismaService,
        UserService,
        JwtService,
        {
          provide: RedisvService,
          useClass: RedisModule,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
