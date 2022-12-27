import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  CacheKey,
  CacheTTL,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: '사용자 저장' })
  @ApiResponse({ status: 201, description: '생성성공' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  @ApiOperation({ summary: '사용자 전체 조회' })
  @ApiResponse({ status: 200, description: '전체 조회 성공' })
  findAll() {
    console.log('findAll');
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: '아이디로 사용자 조회' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('call FindOne');
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: '사용자 정보 업데이트' })
  @ApiResponse({ status: 200, description: '업데이트 성공' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: '아이디로 사용자 삭제' })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
