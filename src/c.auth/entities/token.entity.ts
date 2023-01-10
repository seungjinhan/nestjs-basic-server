import { Token } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class Auth {}

export class TokenEntity implements Token {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  token: string;

  @ApiProperty()
  created: Date;

  @ApiProperty()
  updated: Date;
}
