import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class SearchCondisionUser {
  @ApiProperty()
  id?: number | -1;

  @ApiProperty()
  email?: string | null;

  @ApiProperty()
  name?: string | null;

  @ApiProperty({ required: false, nullable: true })
  phone?: string | null;

  @ApiProperty()
  isActive?: boolean | null;

  @ApiProperty({ required: false, nullable: true })
  nick_name?: string | null;

  @ApiProperty({ required: false, nullable: true })
  country?: string | null;

  @ApiProperty({ default: Role.USER })
  role?: Role | null;

  @ApiProperty()
  created?: Date | null;

  @ApiProperty()
  updated?: Date | null;

  static makeJson = (conditions: SearchCondisionUser): any => {
    const where = {};
    if (conditions.id) {
      where['id'] = conditions.id;
    }
    if (conditions.name) {
      where['name'] = conditions.name;
    }
    if (conditions.email) {
      where['email'] = conditions.email;
    }
    if (conditions.phone) {
      where['phone'] = conditions.phone;
    }
    if (conditions.isActive) {
      where['isActive'] = conditions.isActive;
    }
    if (conditions.nick_name) {
      where['nick_name'] = conditions.nick_name;
    }
    if (conditions.country) {
      where['country'] = conditions.country;
    }
    if (conditions.role) {
      where['role'] = conditions.role;
    }

    return where;
  };
}
