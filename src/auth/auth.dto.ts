import {
  IsBoolean,
  IsEnum,
  IsNested,
  IsString,
  PartialType,
  PickType,
} from '@danieluhm2004/nestjs-tools';

import { User } from '../user/user.entity';
import { Session } from './session/session.entity';

export const authLoginMethod = [
  'login-with-email',
  'login-with-password',
  'signup-with-email',
] as const;

export type AuthLoginMethod = (typeof authLoginMethod)[number];

export class AuthGetResponseDto {
  @IsNested({ type: User, description: '사용자 정보' })
  user: User;

  @IsNested({ type: Session, description: '세션 정보' })
  session: Session;
}

export class AuthSignupBodyDto {
  @IsString({ description: '이름', optional: true })
  name?: string;

  @IsString({ description: '비밀번호', optional: true })
  password?: string;

  @IsBoolean({ description: '마케팅 수신 동의 여부', optional: true })
  marketing?: boolean;

  @IsString({ description: '인증 ID' })
  emailId: string;
}

export class AuthUpdateBodyDto extends PartialType(
  PickType(User, ['name', 'profileUrl']),
) {
  @IsString({ description: '인증 ID', optional: true })
  emailId?: string;

  @IsString({ description: '비밀번호', optional: true })
  password?: string;

  @IsString({ description: '이메일', optional: true })
  email?: string;

  @IsBoolean({ description: '마케팅 수신 동의 여부', optional: true })
  marketing?: boolean;
}

export class AuthUpdateResponseDto extends AuthGetResponseDto {}

export class AuthLoginEmailBodyDto {
  @IsString({ description: '인증 ID' })
  emailId: string;
}

export class AuthLoginGetMethodResponseDto {
  @IsEnum({ enum: { authLoginMethod } as any, description: '로그인 방법' })
  method: AuthLoginMethod;
}

export class AuthLoginPasswordBodyDto {
  @IsString({ description: '이메일' })
  emailAddress: string;

  @IsString({ description: '비밀번호' })
  password: string;
}

export class AuthLoginEmailResponseDto {
  @IsNested({ type: User, description: '사용자 정보' })
  user: User;

  @IsNested({ type: Session, description: '세션 정보' })
  session: Session;
}

export class AuthKycConfirmResponseDto {}

export class AuthLoginPasswordResponseDto extends AuthLoginEmailResponseDto {}
export class AuthSignupResponseDto extends AuthLoginEmailResponseDto {}
