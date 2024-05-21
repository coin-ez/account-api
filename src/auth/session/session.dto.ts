import {
  FindDto,
  IsNested,
  IsNumber,
  PickType,
} from '@danieluhm2004/nestjs-tools';

import { Session } from './session.entity';

export class SessionCreateBodyDto extends PickType(Session, [
  'name',
  'token',
]) {}

export class SessionFindQueryDto extends FindDto {}

export class SessionFindResponseDto {
  @IsNested({ type: Session, description: '리스트', isArray: true })
  sessions: Session[];

  @IsNumber({ description: '총 개수' })
  total: number;
}

export class SessionFindOneResponseDto {
  @IsNested({ type: Session, description: '정보' })
  session: Session;
}

export class SessionCreateResponseDto extends SessionFindOneResponseDto {}

export class SessionUpdateBodyDto extends SessionCreateBodyDto {}

export class SessionUpdateResponseDto extends SessionFindOneResponseDto {}

export class SessionDeleteResponseDto {}

export class SessionDeleteAllResponseDto {}
