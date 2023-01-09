import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { PrismaService } from '../config/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createFileDto: CreateFileDto) {
    return await this.prisma.files.create({ data: createFileDto });
  }

  async findOne(id: number) {
    return await this.prisma.files.findUnique({ where: { id } });
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return this.prisma.files.update({ where: { id }, data: updateFileDto });
  }

  async remove(id: number) {
    const file = await this.findOne(id);
    await fs.unlink(file.path, (err) => {
      return err;
    });
    return await this.prisma.files.delete({ where: { id } });
  }
}
