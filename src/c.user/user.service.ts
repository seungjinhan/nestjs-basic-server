import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../config/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ObjectUtil } from '../libs/utils/object';
import { ExceptionCode } from '../libs/constants/exception_code';
import { SearchCondisionUser } from './dto/search-condition-user.dto';
import { EmailLoginDto } from 'src/c.auth/dto/email-login.dto';
import { Role, User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자 생성
   * @param user
   * @returns
   */
  async create(user: CreateUserDto): Promise<UserEntity> {
    const res = this.prisma.$transaction(async (prisma) => {
      return this.createForTransaction(user, prisma);
    });
    return res;
    // 현재 이메일이 존재 하는지 확인
    // const dbUser: UserEntity = await this.prisma.user.findUnique({
    //   where: { email: user.email },
    // });

    // if (!ObjectUtil.isNotEmpty(dbUser)) {
    //   return this.prisma.user.create({ data: user });
    // } else {
    //   throw new HttpException(
    //     ExceptionCode.AUTH.ALREADY_EXIST_USER,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
  }

  async createForTransaction(
    user: CreateUserDto,
    _prisma: Prisma.TransactionClient,
  ): Promise<UserEntity> {
    // 현재 이메일이 존재 하는지 확인
    const dbUser: UserEntity = await _prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!ObjectUtil.isNotEmpty(dbUser)) {
      return _prisma.user.create({ data: user });
    } else {
      throw new HttpException(
        ExceptionCode.AUTH.ALREADY_EXIST_USER,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 전체조회
   * @param conditions
   * @returns
   */
  async findAll(take: number, skip: number, where) {
    const skipReal: number = take * skip;

    try {
      return {
        count: await this.prisma.user.count({ where }),
        list: await this.prisma.user.findMany({
          skip: skipReal,
          take,
          where,
          orderBy: { id: 'desc' },
        }),
      };
    } catch {
      throw new HttpException(
        ExceptionCode.COMMON.WRONG_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 이메일로 사용자 조회
   * @param email
   * @returns
   */
  async findUserFromEmail(email: string): Promise<UserEntity> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   *
   * @param id
   * @returns
   */
  async findUserByUserId(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
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
    try {
      return this.prisma.user.findMany({
        where: where,
        orderBy: { id: 'desc' },
      });
    } catch {
      throw new HttpException(
        ExceptionCode.COMMON.WRONG_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAdmin(isIncludeSuper: boolean): Promise<UserEntity[] | undefined> {
    const where: any = {
      where: {
        OR: [
          {
            role: 'ADMIN',
          },
          isIncludeSuper ? { role: 'SUPER' } : {},
        ],
      },
    };

    return this.prisma.user.findMany(where);
  }

  /**
   *
   * @param where
   * @returns
   */
  async findAllWithWhere(where: any): Promise<UserEntity[] | undefined> {
    try {
      return this.prisma.user.findMany({ where });
    } catch {
      throw new HttpException(
        ExceptionCode.COMMON.WRONG_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   *
   * @param emailLoginDto
   * @param roles
   * @returns
   */
  async findOneByEmailAndRole(
    emailLoginDto: EmailLoginDto,
    roles: Role[] = [Role.USER],
  ): Promise<UserEntity | undefined> {
    try {
      const dbUser: User = await this.prisma.user.findUnique({
        where: { email: emailLoginDto.email },
      });
      console.log(dbUser, roles);

      if (dbUser === null) {
        return dbUser;
      }

      for (let index = 0; index < roles.length; index++) {
        if (dbUser.role === roles[index]) {
          return dbUser;
        }
      }
    } catch {
      throw new HttpException(
        ExceptionCode.COMMON.WRONG_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   *
   * @param id
   * @param user
   * @returns
   */
  async update(id: number, user: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: user,
      });
    } catch (err) {
      console.error(err);
      throw new HttpException(
        ExceptionCode.COMMON.WRONG_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   *
   * @param id
   * @param isActivity
   * @returns
   */
  async updateActivity(id: number, isActive: boolean): Promise<UserEntity> {
    const res = await this.prisma.user.update({
      where: { id },
      data: { isActive },
    });
    return res;
  }

  /**
   *
   * @param id
   * @returns
   */
  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
