import { ApiProperty } from '@nestjs/swagger';
import { Auth, AuthType } from '@prisma/client';

export class SnsAuthEntity implements Auth {
  @ApiProperty()
  id: number;

  @ApiProperty()
  created: Date;

  @ApiProperty()
  updated: Date;

  @ApiProperty()
  type: AuthType;

  @ApiProperty()
  token: string;

  @ApiProperty()
  userId: number;
}
