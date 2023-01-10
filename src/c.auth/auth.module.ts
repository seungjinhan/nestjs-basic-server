import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaModule } from '../config/prisma/prisma.module';
import { SessionModule } from '../c.session/session.module';
import { UserModule } from 'src/c.user/user.module';
import { jwtConstants } from 'src/config/authentication/jwt_constants';

@Module({
  imports: [
    SessionModule,
    PrismaModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: process.env.SESSION_TIME }, // https://github.com/zeit/ms.js
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
