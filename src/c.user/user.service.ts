import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../config/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ObjectUtil } from '../libs/utils/object';
import { ExceptionCode } from '../libs/constants/exception_code';
import { ConditionWithPagingDto } from 'src/libs/dto/condition.paging.dto';
import { SearchCondisionUser } from './dto/search-condition-user.dto';
import { EmailLoginDto } from 'src/c.auth/dto/email-login.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자 생성
   * @param user
   * @returns
   */
  async create(user: CreateUserDto) {
    const dbUser: UserEntity = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!ObjectUtil.isNotEmpty(dbUser)) {
      return this.prisma.user.create({ data: user });
    }
    throw new HttpException(
      ExceptionCode.AUTH.ALREADY_EXIST_USER,
      HttpStatus.BAD_REQUEST,
    );
  }

  /**
   * 전체조회
   * @param conditions
   * @returns
   */
  async findAll(
    conditions: ConditionWithPagingDto = undefined,
  ): Promise<UserEntity[]> {
    let condisions = {};

    if (condisions !== undefined && conditions.size > 0 && conditions.page > 0)
      condisions = {
        skip: conditions.page,
        take: conditions.size,
      };

    return this.prisma.user.findMany(condisions);
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * 조건에 완벽한 항목들 조회
   * @param conditions
   * @returns
   */
  async findAllByConditions(
    conditions: SearchCondisionUser,
  ): Promise<UserEntity[] | undefined> {
    const where = SearchCondisionUser.makeJson(conditions);
    return this.prisma.user.findMany({ where: where });
  }

  async findAllWithWhere(where: any): Promise<UserEntity[] | undefined> {
    return this.prisma.user.findMany({ where });
  }

  async findOneByEmail(
    emailLoginDto: EmailLoginDto,
  ): Promise<UserEntity | undefined> {
    if (emailLoginDto.role == null) {
      return this.prisma.user.findUnique({
        where: { email: emailLoginDto.email },
      });
    } else {
      return this.prisma.user.findFirst({
        where: { email: emailLoginDto.email, role: emailLoginDto.role! },
      });
    }
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
