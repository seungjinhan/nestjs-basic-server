import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ConditionWithPagingDto {
  @IsNumber()
  @ApiProperty()
  skip?: number = -1;

  @IsNumber()
  @ApiProperty()
  take?: number = -1;

  @ApiProperty()
  where: Map<string, string>;
}
