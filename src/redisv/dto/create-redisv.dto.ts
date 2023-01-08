import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateRedisvDto {
  @IsString()
  @ApiProperty()
  key: string;

  @IsString()
  @ApiProperty()
  value: string | Map<string, string>;
}
