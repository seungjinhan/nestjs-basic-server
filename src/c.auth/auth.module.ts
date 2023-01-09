import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { EmailpwStrategy } from '@config/guards/email.pw/email.pw.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@src/config/authentication/jwt_constants';
import { UserModule } from '@src/c.user/user.module';
import { AuthService } from './auth.service';
import { PrismaModule } from '../config/prisma/prisma.module';
import { SessionModule } from '../c.session/session.module';

@Module({
  imports: [
    SessionModule,
    PrismaModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' }, // https://github.com/zeit/ms.js
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailpwStrategy],
})
export class AuthModule {}
