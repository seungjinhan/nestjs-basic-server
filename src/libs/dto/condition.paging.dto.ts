import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ConditionWithPagingDto {
  @IsNumber()
  @ApiProperty()
  page?: number = -1;

  @IsNumber()
  @ApiProperty()
  size?: number = -1;

  @ApiProperty()
  conditions: Map<string, string>;
}
