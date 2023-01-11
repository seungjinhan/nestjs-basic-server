import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  phone: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ required: false, nullable: true })
  nickName: string;

  @ApiProperty({ required: false, nullable: true })
  country: string;

  @ApiProperty({ required: false, nullable: true })
  profileImgId: number;

  @ApiProperty()
  created: Date;

  @ApiProperty()
  updated: Date;

  covertFromEntity(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.email = userEntity.email;
    this.name = userEntity.name;
    this.phone = userEntity.phone;
    this.isActive = userEntity.isActive;
    this.nickName = userEntity.nickName;
    this.country = userEntity.country;
    this.profileImgId = userEntity.profileImgId;
    this.created = userEntity.created;
    this.updated = userEntity.updated;
  }
}
