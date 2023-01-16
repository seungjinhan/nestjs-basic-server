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
  ParseBoolPipe,
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
import { makeResponse } from '../libs/utils/api';
import { Base64DecodePipe, JsonPipe } from 'nestjs-json-pipe';

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
    return makeResponse(true, resUser);
  }

  /**
   * 조건에 맞는 항목 조회
   * @param conditions
   * @returns
   */
  @Get('search')
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  @ApiOperation({ summary: '사용자 조건에 맞게 조회' })
  async findWithCondition(@Body() conditions?: SearchCondisionUser) {
    return makeResponse(
      true,
      await this.userService.findAllByConditions(conditions),
    );
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
    return makeResponse(true, this.userService.findOne(id));
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
    return makeResponse(true, this.userService.update(id, updateUserDto));
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
    return makeResponse(true, this.userService.remove(id));
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
  async findAllWithCondition(
    @Query('size', ParseIntPipe) take: number,
    @Query('page', ParseIntPipe) skip: number,
    @Query('where', JsonPipe) where: any,
  ) {
    return makeResponse(
      true,
      await this.userService.findAll(take, skip, where),
    );
  }

  // @MUST_AUTH(Role.ADMIN)
  @Patch('/update/active/:id/:isActive')
  @ApiOperation({ summary: '사용자 활성화 수정' })
  async updateUserActive(
    @Param('id', ParseIntPipe) id: number,
    @Param('isActive', ParseBoolPipe) isActive: boolean,
  ) {
    return makeResponse(true, this.userService.updateActivity(id, isActive));
  }
}
