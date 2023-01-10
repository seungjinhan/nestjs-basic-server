import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConditionWithPagingDto } from 'src/libs/dto/condition.paging.dto';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 생성
   * @param createUserDto
   * @returns
   */
  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: '사용자 저장' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * 사용자 조회
   * @param conditions
   * @returns
   */
  @Get()
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  @ApiOperation({ summary: '사용자 전체 조회' })
  findAll(@Body() conditions?: ConditionWithPagingDto) {
    console.log(conditions);
    return this.userService.findAll(conditions);
  }

  /**
   * 사용자 아이디로 조회
   * @param id
   * @returns
   */
  @Get(':id')
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: '아이디로 사용자 조회' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('call FindOne');
    return this.userService.findOne(id);
  }

  /**
   * 사용자 업데이트
   * @param id
   * @param updateUserDto
   * @returns
   */
  @Patch(':id')
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: '사용자 정보 업데이트' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   *
   * @param id
   * @returns
   */
  @Delete(':id')
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: '아이디로 사용자 삭제' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
