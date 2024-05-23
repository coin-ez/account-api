import { IsNested, IsString } from '@danieluhm2004/nestjs-tools';
import { User } from 'src/user/user.entity';

export class BodyGetUserByAccessTokenInternalDto {
  @IsString({
    description: '액세스 토큰',
    example: '9ETHCpT+jMrBxP7KCuDScO5HTtmwmazZ8+IZYI3p30I=',
  })
  accessToken: string;
}

export class ResGetUserByAccessTokenInternalDto {
  @IsNested({
    description: '사용자 정보',
    type: User,
  })
  user: User;
}
