import { PickType } from '@danieluhm2004/nestjs-tools';

import { Phone } from './phone.entity';

export class PhoneSendBodyDto extends PickType(Phone, ['phoneNum']) {}

export class PhoneSendResponseDto {}

export class PhoneVerifyBodyDto extends PickType(Phone, [
  'phoneNum',
  'verifyCode',
]) {}

export class PhoneVerifyResponseDto extends PickType(Phone, ['phoneId']) {}
