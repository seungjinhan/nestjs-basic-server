import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggingInterceptor } from '../config/interceptors/logger.interceptor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from 'config/roles/roles.guard';

@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      exclude: ['/api*'],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
