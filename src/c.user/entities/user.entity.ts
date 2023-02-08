import { Gender, IdType, Role, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  phone: string;

  @Exclude()
  @ApiProperty()
  password: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ required: false, nullable: true })
  country: string;

  @ApiProperty({ required: false, nullable: true })
  profileImgId: number;

  @ApiProperty({ required: false, nullable: true })
  email_sub: string;

  @ApiProperty({ required: false, nullable: true })
  birth: string;

  @ApiProperty({ required: false, nullable: true })
  passport_f_name: string;

  @ApiProperty({ required: false, nullable: true })
  passport_name: string;

  @ApiProperty({ required: false, nullable: true })
  passport_number: string;

  @ApiProperty({ required: false, nullable: true })
  gender: Gender;

  @ApiProperty({ required: false, nullable: true })
  staying_country: string;

  @ApiProperty({ required: false, nullable: true })
  id_type: IdType;

  @ApiProperty({ required: false, nullable: true })
  address: string;

  @ApiProperty({ required: false, nullable: true })
  use_lang: string;

  @ApiProperty({ default: Role.USER })
  role: Role;

  @ApiProperty()
  created: Date;

  @ApiProperty()
  updated: Date;
}
