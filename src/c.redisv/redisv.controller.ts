import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { RedisvService } from './redisv.service';
import { CreateRedisvDto } from './dto/create-redisv.dto';
import { APIReturnType, makeResponse } from '../libs/utils/api';

export interface RedisGetType {
  key: string;
  type: 'STRING' | 'MAP';
  mapKey?: string;
}
@Controller('redisv')
export class RedisvController {
  constructor(private readonly redisvService: RedisvService) {}

  /**
   * 레디스에 데이터 저장
   * @param createRedisvDto
   * @returns
   */
  @Post()
  set(@Body() createRedisvDto: CreateRedisvDto): APIReturnType {
    return makeResponse(true, this.redisvService.set(createRedisvDto));
  }

  /**
   * 레디스에서 데이터 조회
   * @param key 데이터키
   * @param type 테이터 타입
   * @param mapKey 맵일 경우 맵의 키
   * @returns
   */
  @Get()
  async get(
    @Query('key') key: string,
    @Query('type') type: 'STRING' | 'MAP',
    @Query('mapKey') mapKey?: string,
  ): Promise<APIReturnType> {
    const res = await this.redisvService.get({ key, type, mapKey });
    return makeResponse(true, res);
  }

  /**
   * 키를 확인
   * @param key
   * @returns
   */
  @Get('/isKey/:key')
  async isKey(@Param('key') key: string): Promise<APIReturnType> {
    const res = await this.redisvService.isKey(key);
    return makeResponse(true, res);
  }

  /**
   * 데이터 삭제
   * @param key
   * @returns
   */
  @Delete('/:key')
  async delete(@Param('key') key: string): Promise<APIReturnType> {
    const res = await this.redisvService.del(key);
    return makeResponse(true, res);
  }
}
