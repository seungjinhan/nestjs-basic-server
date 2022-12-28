import { join } from 'path';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@config/prisma/prisma.module';

import { UserModule } from '@src/user/user.module';
import { AuthModule } from '@src/auth/auth.module';
import { LoggingInterceptor } from '@src/config/interceptors/logger.interceptor';
import { SampleModule } from '@src/sample/sample.module';
import { FilesModule } from './files/files.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from './config/cache/cache.module';
import { AuthInterceptor } from './config/interceptors/auth.interceptor';
import { MustAuthGuard } from './config/annotations/authCheck/must.auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      exclude: ['/api*', '/docs*'],
    }),
    ConfigModule,
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
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
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: MustAuthGuard,
    },
  ],
})
export class AppModule {}
