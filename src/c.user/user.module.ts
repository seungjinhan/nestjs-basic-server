import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../config/prisma/prisma.module';
import { CacheModule } from '../config/cache/cache.module';
import { PrismaService } from '@config/prisma/prisma.service';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, PrismaService],
})
export class UserModule {}
