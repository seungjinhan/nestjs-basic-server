import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  ParseBoolPipe,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchCondisionUser } from './dto/search-condition-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { makeResponse } from '../libs/utils/api';
import { JsonPipe } from 'nestjs-json-pipe';
import { APIReturnType } from '../../dist/libs/utils/api';
import { MUST_AUTH } from 'src/config/annotations/must.auth/must.auth.decorator';
import { Request } from 'express';
import { Role } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 조건에 맞는 항목 조회
   * @param conditions
   * @returns
   */
  @MUST_AUTH(Role.SUPER)
  @Get('search')
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  @ApiOperation({ summary: '사용자 조건에 맞게 조회' })
  async findWithCondition(@Body() conditions?: SearchCondisionUser) {
    return makeResponse(
      true,
      await this.userService.findAllByConditions(conditions),
    );
  }

  @MUST_AUTH(Role.ADMIN)
  @Get('search_admin')
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  @ApiOperation({ summary: '어드민 조회' })
  async findAdmin(
    @Query('isIncludeSuper', ParseBoolPipe) isIncludeSuper: boolean,
  ) {
    return makeResponse(true, await this.userService.findAdmin(isIncludeSuper));
  }

  /**
   * 사용자 아이디로 조회
   * @param id
   * @returns
   */
  @MUST_AUTH(Role.ADMIN)
  @Get('profile/:id')
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: '아이디로 사용자 조회' })
  async profile(@Param('id', ParseIntPipe) id: number): Promise<APIReturnType> {
    const user = new UserResponseDto();
    const resUser = await user.covertFromEntity(
      await this.userService.findUserByUserId(id),
    );
    return makeResponse(true, resUser);
  }

  /**
   * @param req
   * @returns
   */
  @MUST_AUTH()
  @ApiOperation({ summary: '사용자 프로필 조회 (토큰필요)' })
  @ApiCreatedResponse({ type: UserEntity })
  @Get('my_profile')
  myProfile(@Req() req: Request) {
    return makeResponse(true, req.user);
  }

  /**
   * 사용자 업데이트
   * @param id
   * @param updateUserDto
   * @returns
   */
  @MUST_AUTH()
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: '사용자 정보 업데이트' })
  @Patch(':id')
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
  @MUST_AUTH(Role.ADMIN)
  @ApiCreatedResponse({ type: UserEntity })
  @ApiOperation({ summary: '아이디로 사용자 삭제' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return makeResponse(true, this.userService.remove(id));
  }

  /**
   * 사용자 조회 - 관리자용
   * @param conditions
   * @returns
   */
  @MUST_AUTH(Role.ADMIN)
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  @ApiOperation({ summary: '사용자 전체 조회' })
  @Get()
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

  @MUST_AUTH(Role.ADMIN)
  @ApiCreatedResponse({ type: UserEntity, isArray: false })
  @ApiOperation({ summary: '사용자 활성화 수정' })
  @Patch('/update/active/:id/:isActive')
  async updateUserActive(
    @Param('id', ParseIntPipe) id: number,
    @Param('isActive', ParseBoolPipe) isActive: boolean,
  ) {
    return makeResponse(true, this.userService.updateActivity(id, isActive));
  }
}
