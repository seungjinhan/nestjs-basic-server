import {
  CacheKey,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Post,
} from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  add() {
    return this.sessionService.setSession(1, 'asdfsd');
  }

  @CacheKey('session_get')
  @CacheTTL(20)
  @Get()
  get() {
    return this.sessionService.getSessionByUserId(1);
  }

  @Delete()
  del() {
    return this.sessionService.delSession(1);
  }
}
