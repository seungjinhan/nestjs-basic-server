import { join } from 'path';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '@src/user/user.module';
import { AuthModule } from '@src/auth/auth.module';
import { LoggingInterceptor } from '@src/config/interceptors/logger.interceptor';
import { JwtAuthGuard } from '@src/config/annotations/no_jwt/no.jwt.guard';
import { RolesGuard } from '@src/config/annotations/roles/roles.guard';
import { SampleModule } from '@src/sample/sample.module';
import { FilesModule } from './files/files.module';
import { ThrottlerModule } from '@nestjs/throttler';

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
    { provide: APP_GUARD, useClass: JwtAuthGuard }, // 전체 가 JWT를 가져야 처리.. Skip하려면 @Public()
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
