import { ApiProperty } from '@nestjs/swagger';
import { SnsTokenType } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SnsJoinLoginDto {
  @ApiProperty()
  type: SnsTokenType;

  @IsNotEmpty()
  @ApiProperty()
  token: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
