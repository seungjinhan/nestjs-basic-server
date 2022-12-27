import { join } from 'path';
import { CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@config/prisma/prisma.module';

import { UserModule } from '@src/user/user.module';
import { AuthModule } from '@src/auth/auth.module';
import { LoggingInterceptor } from '@src/config/interceptors/logger.interceptor';
import { SampleModule } from '@src/sample/sample.module';
import { FilesModule } from './files/files.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpCacheInterceptor } from './config/interceptors/http.cache.Interceptor';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 10,
    }),
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
      useClass: HttpCacheInterceptor,
    },
    // { provide: APP_GUARD, useClass: JwtAuthGuard }, // 전체 가 JWT를 가져야 처리.. Skip하려면 @Public()
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
