import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { Gender, IdType, Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  created: Date;

  @ApiProperty()
  updated: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, nullable: true })
  profileImgId: number;

  @ApiProperty({ required: false, nullable: true })
  email_sub: string;

  @ApiProperty({ required: false, nullable: true })
  birth: string;

  @ApiProperty({ required: false, nullable: true })
  country: string;

  @ApiProperty({ required: false, nullable: true })
  phone: string;

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

  @ApiProperty()
  role: Role;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  sessionKey: string;

  covertFromEntity(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.created = userEntity.created;
    this.updated = userEntity.updated;
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.profileImgId = userEntity.profileImgId;
    this.email_sub = userEntity.email_sub;
    this.birth = userEntity.birth;
    this.country = userEntity.country;
    this.phone = userEntity.phone;
    this.passport_f_name = userEntity.passport_f_name;
    this.passport_name = userEntity.passport_name;
    this.passport_number = userEntity.passport_number;
    this.gender = userEntity.gender;
    this.staying_country = userEntity.staying_country;
    this.id_type = userEntity.id_type;
    this.address = userEntity.address;
    this.use_lang = userEntity.use_lang;
    this.role = userEntity.role;
    this.isActive = userEntity.isActive;
  }
}
