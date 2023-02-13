import { ApiProperty } from '@nestjs/swagger';
import { SnsToken, SnsTokenType } from '@prisma/client';
import { BaseEntity } from '../../libs/entity/base_entity';

export class SnsTokenEntity extends BaseEntity implements SnsToken {
  @ApiProperty()
  type: SnsTokenType;
  @ApiProperty()
  token: string;
  @ApiProperty()
  userId: number;
}
