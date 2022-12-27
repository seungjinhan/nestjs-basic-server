import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../config/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

export type User = any;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(user: CreateUserDto) {
    return this.prisma.user.create({ data: user });
  }

  findAll() {
    console.log('findAll Server');
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    console.log('findOne Server');
    return this.prisma.user.findUnique({ where: { id } });
  }
  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  update(id: number, user: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
