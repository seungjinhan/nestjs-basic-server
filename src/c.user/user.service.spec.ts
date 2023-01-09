import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common';

import { UserService } from './user.service';
import { PrismaService } from '../config/prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService, CacheModule],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
