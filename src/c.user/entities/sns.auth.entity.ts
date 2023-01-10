import { ApiProperty } from '@nestjs/swagger';
import { SnsAuth, SnsAuthType } from '@prisma/client';

export class SnsAuthEntity implements SnsAuth {
  @ApiProperty()
  id: number;

  @ApiProperty()
  created: Date;

  @ApiProperty()
  updated: Date;

  @ApiProperty()
  type: SnsAuthType;

  @ApiProperty()
  token: string;

  @ApiProperty()
  userId: number;
}
