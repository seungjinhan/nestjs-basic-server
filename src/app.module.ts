import { join } from 'path';
import {
  CacheModule,
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
import { CacheInterceptor } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';

import { LoggerMiddleware } from './config/middleware/http.logger.middleware';
import { SessionModule } from './c.session/session.module';
import { RedisvModule } from './c.redisv/redisv.module';
import { SocketServerGateway } from './c.socket.server/socket.server.gateway';
import { PrismaModule } from './config/prisma/prisma.module';
import { UserModule } from './c.user/user.module';
import { AuthModule } from './c.auth/auth.module';
import { SampleModule } from './sample/sample.module';
import { FilesModule } from './c.files/files.module';
import { LoggingInterceptor } from './config/interceptors/logger.interceptor';
import { MustAuthGuard } from './config/guards/must.auth/must.auth.guard';
import { TasksModule } from './c.tasks/tasks.module';

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
    CacheModule.register(),
    JwtModule,
    HttpModule,
    /////////////////////////////////////////////////////////////////////
    TasksModule,
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
