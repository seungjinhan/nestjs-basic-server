import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../config/authentication/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@src/config/authentication/jwt_constants';
import { JwtStrategy } from '@src/config/authentication/jwt.strategy';
import { UserModule } from '@src/user/user.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1y' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
