import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaModule } from '../config/prisma/prisma.module';
import { PrismaService } from '../config/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [FilesController],
  providers: [FilesService, PrismaService],
})
export class FilesModule {}
