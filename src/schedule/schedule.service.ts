import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';

/**
 * https://docs.nestjs.com/techniques/task-scheduling
 */
@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  // @Cron('45 * * * * *')
  // handleCron() {
  //   this.logger.debug('Called when the current second is 45');
  // }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // handleCron2() {
  //   this.logger.debug('Called cron2');
  // }

  // @Interval(1000)
  // handleInterval() {
  //   this.logger.debug('interval 1000');
  // }
}
