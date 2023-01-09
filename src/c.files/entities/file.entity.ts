import { Files } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FileEntity implements Files {
  @ApiProperty()
  id: number;
  @ApiProperty()
  originalname: string;
  @ApiProperty()
  encoding: string;
  @ApiProperty()
  mimetype: string;
  @ApiProperty()
  destination: string;
  @ApiProperty()
  filename: string;
  @ApiProperty()
  path: string;
  @ApiProperty()
  size: number;
  @ApiProperty()
  more01: string;
  @ApiProperty()
  more02: string;
  @ApiProperty()
  created: Date;
  @ApiProperty()
  updated: Date;
}
