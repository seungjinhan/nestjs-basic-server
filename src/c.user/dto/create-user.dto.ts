import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  id: number;

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

  @ApiProperty()
  isActive?: boolean;

  @ApiProperty({ required: false, nullable: true })
  nickName?: string;

  @ApiProperty({ required: false, nullable: true })
  country?: string;

  @ApiProperty({ required: false, nullable: true })
  profileImgId?: number;
}
