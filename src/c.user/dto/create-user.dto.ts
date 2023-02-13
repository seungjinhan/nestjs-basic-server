import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * 사용자 생성 DTO
 */
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  password: string;

  constructor({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) {
    this.email = email;
    this.name = name;
    this.password = password;
  }
}
