import { join } from 'path';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '@src/config/prisma/prisma.module';
import { UserModule } from '@src/c.user/user.module';
import { AuthModule } from '@src/c.auth/auth.module';
import { LoggingInterceptor } from '@src/config/interceptors/logger.interceptor';
import { SampleModule } from '@src/sample/sample.module';
import { CacheModule } from '@src/config/cache/cache.module';
import { MustAuthGuard } from '@config/guards/must.auth/must.auth.guard';
import { FilesModule } from '@src/c.files/files.module';
import { LoggerMiddleware } from './config/middleware/http.logger.middleware';
import { SessionModule } from './c.session/session.module';
import { RedisvModule } from './c.redisv/redisv.module';
import { CacheInterceptor } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleModule as MyScheduleModule } from '@src/c.schedule/schedule.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';
import { SocketServerGateway } from './c.socket.server/socket.server.gateway';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      exclude: ['/api*', '/docs*'],
    }),
    ConfigModule,
    ConfigModule.forRoot({ envFilePath: [`.env.${process.env.NODE_ENV}`] }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    PrismaModule,
    CacheModule,
    JwtModule,
    HttpModule,
    /////////////////////////////////////////////////////////////////////
    MyScheduleModule,
    UserModule,
    AuthModule,
    SampleModule,
    FilesModule,
    SessionModule,
    RedisvModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: MustAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    SocketServerGateway,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
