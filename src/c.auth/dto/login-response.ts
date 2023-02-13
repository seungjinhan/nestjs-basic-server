import { ApiProperty } from '@nestjs/swagger';

// 로그인 반환값
export class LoginResponseDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  sessionKey: string;
}
