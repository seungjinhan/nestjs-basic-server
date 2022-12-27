import { PartialType } from '@nestjs/swagger';
import { CreateUserDto, CreateProfileDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
