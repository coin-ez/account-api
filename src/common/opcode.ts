import { $, HttpStatus, globalOpcode } from '@danieluhm2004/nestjs-tools';

export const Opcode = {
  ...globalOpcode,
  PasswordNotMatch: $(
    2001,
    HttpStatus.BAD_REQUEST,
    '비밀번호가 일치하지 않습니다.',
  ),
  CannotFindSession: $(
    2002,
    HttpStatus.NOT_FOUND,
    '해당하는 세션을 찾을 수 없습니다.',
  ),
  PermissionRequired: $(
    2003,
    HttpStatus.FORBIDDEN,
    '이 요청을 실행할 권한이 없습니다.',
  ),
  LoginRequired: $(
    2004,
    HttpStatus.UNAUTHORIZED,
    '해당 기능은 로그인이 필요합니다.',
  ),
  CannotFindUser: $(
    2005,
    HttpStatus.NOT_FOUND,
    '해당 사용자를 찾을 수 없습니다.',
  ),
  AlreadyUsingEmailAddress: $(
    2006,
    HttpStatus.BAD_REQUEST,
    '이미 사용중인 이메일입니다.',
  ),
  ExcessedEmail: $(
    2007,
    HttpStatus.BAD_REQUEST,
    '이메일 인증 횟수를 초과하였습니다.',
  ),
  CannotFindEmail: $(
    2008,
    HttpStatus.NOT_FOUND,
    '해당 이메일을 찾을 수 없습니다.',
  ),
  InvalidVerifyCode: $(
    2009,
    HttpStatus.BAD_REQUEST,
    '인증번호가 일치하지 않습니다.',
  ),
};
