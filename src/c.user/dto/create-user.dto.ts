import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  phone?: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
