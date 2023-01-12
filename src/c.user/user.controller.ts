import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
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
import { SearchCondisionUser } from './dto/search-condition-user.dto';
import { Role } from '@prisma/client';
import { MUST_AUTH } from 'src/config/annotations/must.auth/must.auth.decorator';
import { UserResponseDto } from './dto/user-response.dto';

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
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiOperation({ summary: '사용자 저장' })
  async create(@Body() createUserDto: CreateUserDto) {
    const resUser: UserResponseDto = new UserResponseDto();
    const newLocal = await this.userService.create(createUserDto);
    resUser.covertFromEntity(newLocal);
    return resUser;
  }

  /**
   * 조건에 맞는 항목 조회
   * @param conditions
   * @returns
   */
  @Get('search')
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  @ApiOperation({ summary: '사용자 조건에 맞게 조회' })
  findWithCondition(@Body() conditions?: SearchCondisionUser) {
    return this.userService.findAllByConditions(conditions);
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
   * 사용자 삭제
   * @param id
   * @returns
   */
  @Delete(':id')
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: '아이디로 사용자 삭제' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  /**
   * 사용자 조회 - 관리자용
   * @param conditions
   * @returns
   */
  @MUST_AUTH(Role.ADMIN)
  @Get()
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  @ApiOperation({ summary: '사용자 전체 조회' })
  findAll(@Body() conditions?: ConditionWithPagingDto) {
    return this.userService.findAll(conditions);
  }
}
