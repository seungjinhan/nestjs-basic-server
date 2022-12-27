import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  name: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  phone?: string | null;

  @IsString()
  @ApiProperty()
  password: string;
}

export class CreateProfileDto {
  @IsString()
  @ApiProperty()
  bio: string;

  @IsString()
  @ApiProperty({ required: false })
  img?: string;

  @IsInt()
  @ApiPropertyOptional({ type: () => CreateUserDto })
  userId: number;
}
