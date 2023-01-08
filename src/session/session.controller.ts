import { Controller, Delete, Get, Post } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  add() {
    console.log('dd');
    return this.sessionService.setSession(1, 'asdfsd');
  }

  @Get()
  get() {
    return this.sessionService.getSession(1);
  }

  @Delete()
  del() {
    return this.sessionService.delSession(1);
  }
}
