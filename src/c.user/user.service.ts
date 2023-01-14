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
import { Role } from '@prisma/client';

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
    const where: any = { ...conditions };

    // console.log(conditions);
    // if (
    //   conditions !== undefined &&
    //   conditions.size > -1 &&
    //   conditions.page > -1
    // ) {
    //   where = {
    //     skip: conditions.page,
    //     take: conditions.size,
    //   };
    // }
    // if (conditions !== undefined && conditions.where !== undefined) {
    //   where = { ...where, ...conditions.where };
    // }

    console.log({ ...where });

    //return this.prisma.user.findMany({ skip: 1, take: 1, where: { id: 1 } });
    return this.prisma.user.findMany({ ...where });
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
    role: Role,
  ): Promise<UserEntity | undefined> {
    if (role == null) {
      return this.prisma.user.findUnique({
        where: { email: emailLoginDto.email },
      });
    } else {
      return this.prisma.user.findFirst({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        where: { email: emailLoginDto.email, role: role },
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
