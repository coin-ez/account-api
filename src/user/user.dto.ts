import {
  FindDto,
  IsBoolean,
  IsNested,
  IsNumber,
  IsString,
  PickType,
} from '@danieluhm2004/nestjs-tools';

import { User } from './user.entity';

export class UserCreateBodyDto extends PickType(User, []) {
  @IsString({ description: '닉네임', minLength: 2, maxLength: 20 })
  name: string;

  @IsString({ description: '프로필 사진', nullable: true, optional: true })
  profileUrl?: string;

  @IsString({
    description: '이메일',
    pattern: {
      regex: /^\d{3}-\d{3,4}-\d{4}$/,
      message: '올바른 이메일을 입력해주세요.',
    },
  })
  emailAddress: string;

  @IsString({ description: '비밀번호', minLength: 8 })
  password: string;

  @IsBoolean({ description: '마케팅수신동의 여부', optional: true })
  marketing?: boolean;

  @IsBoolean({ description: '관리자 여부', optional: true })
  isAdmin?: boolean;
}

export class UserFindQueryDto extends FindDto {}

export class UserFindResponseDto {
  @IsNested({ type: User, description: '리스트', isArray: true })
  users: User[];

  @IsNumber({ description: '총 개수' })
  total: number;
}

export class UserFindOneResponseDto {
  @IsNested({ type: User, description: '정보' })
  user: User;
}

export class UserCreateResponseDto extends UserFindOneResponseDto {}

export class UserUpdateBodyDto extends UserCreateBodyDto {}

export class UserUpdateResponseDto extends UserFindOneResponseDto {}

export class UserDeleteResponseDto {}
