import { Role, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity implements User {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false, nullable: true })
  phone: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  created: Date;
  @ApiProperty()
  updated: Date;
  @ApiProperty({ default: Role.USER })
  role: Role;
}
