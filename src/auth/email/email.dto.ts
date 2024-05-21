import { PickType } from '@danieluhm2004/nestjs-tools';

import { Email } from './email.entity';

export class EmailSendBodyDto extends PickType(Email, ['emailAddress']) {}

export class EmailSendResponseDto {}

export class EmailVerifyBodyDto extends PickType(Email, [
  'emailAddress',
  'verifyCode',
]) {}

export class EmailVerifyResponseDto extends PickType(Email, ['emailId']) {}
