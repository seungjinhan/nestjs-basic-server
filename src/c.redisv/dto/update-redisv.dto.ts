import { PartialType } from '@nestjs/swagger';
import { CreateRedisvDto } from './create-redisv.dto';

export class UpdateRedisvDto extends PartialType(CreateRedisvDto) {}
