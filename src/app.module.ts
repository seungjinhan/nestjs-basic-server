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
import { PrismaModule } from '@config/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '@src/user/user.module';
import { AuthModule } from '@src/auth/auth.module';
import { LoggingInterceptor } from '@src/config/interceptors/logger.interceptor';
import { SampleModule } from '@src/sample/sample.module';
import { CacheModule } from '@src/config/cache/cache.module';
import { MustAuthGuard } from '@config/guards/must.auth/must.auth.guard';
import { FilesModule } from '@src/files/files.module';
import { LoggerMiddleware } from './config/middleware/logger.middleware';

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
    PrismaModule,
    CacheModule,
    JwtModule,
    /////////////////////////////////////////////////////////////////////
    UserModule,
    AuthModule,
    SampleModule,
    FilesModule,
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
