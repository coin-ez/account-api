import { PickType } from '@danieluhm2004/nestjs-tools';

import { Magiclink } from './magiclink.entity';

export class EmailSendBodyDto extends PickType(Magiclink, ['email']) {}

export class EmailSendResponseDto {}

export class EmailVerifyBodyDto extends PickType(Magiclink, [
  'email',
  'verifyCode',
]) {}

export class EmailVerifyResponseDto extends PickType(Magiclink, [
  'magiclinkId',
]) {}
