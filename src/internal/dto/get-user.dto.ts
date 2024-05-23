import { IsNested, IsString } from 'nestjs-swagger-dto';
import { User } from '../../user/user.entity';

export class BodyGetUserInternalDto {
  @IsString({
    description: '사용자 ID',
    example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6',
  })
  userId: string;
}

export class ResGetUserInternalDto {
  @IsNested({
    description: '사용자 정보',
    type: User,
  })
  user: User;
}
