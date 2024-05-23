import {
  IsDate,
  IsNested,
  IsObject,
  IsString,
} from '@danieluhm2004/nestjs-tools';

export class ResInternalDto {
  @IsString({ description: '응답 데이터' })
  payload: string;
}

export class BodyInternalDto {
  @IsString({ description: '요청 데이터' })
  payload: string;
}

export class RequestInfoInternalDto {
  @IsString({
    description: '요청자',
    example: 'Someone',
  })
  requestBy: string;

  @IsDate({
    description: '요청 시각',
    example: new Date(),
    format: 'date-time',
  })
  requestedAt: Date;
}

export class ResponseInfoInternalDto {
  @IsString({
    description: '응답자',
    example: 'Someone',
  })
  responseBy: string;

  @IsString()
  @IsDate({
    description: '응답 시각',
    example: new Date(),
    format: 'date-time',
  })
  responsedAt: Date;
}

export class BodyCommonInternalDto {
  @IsString({
    description: '함수 이름',
    example: 'getUserByAccessToken',
  })
  functionName: string;

  @IsNested({
    description: '요청 정보',
    type: RequestInfoInternalDto,
  })
  requestInfo: RequestInfoInternalDto;

  @IsObject({
    description: '요청 데이터',
    example: { hello: 'world' },
  })
  body: any;
}
