import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  name: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  phone?: string | null;

  @IsString()
  @ApiProperty()
  password: string;
}
