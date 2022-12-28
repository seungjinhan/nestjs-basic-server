import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { PrismaService } from '../config/prisma/prisma.service';

export type Token = any;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getAccessToken(user: UserEntity) {
    const payload = { email: user.email, id: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    this.insertToken(user, token);
    return {
      access_token: token,
    };
  }

  async insertToken(user: UserEntity, token: string) {
    const resToken = await this.prisma.token.findUnique({
      where: { id: user.id },
    });
    if (!resToken) {
      await this.prisma.token.create({
        data: { userId: user.id, token: token },
      });
    } else {
      await this.prisma.token.update({
        where: { id: resToken.id },
        data: { token: token },
      });
    }
  }

  async findToken(userId: number): Promise<Token | undefined> {
    return await this.prisma.token.findUnique({ where: { userId } });
  }
}
