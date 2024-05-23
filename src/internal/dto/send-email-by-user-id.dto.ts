import { IsObject, IsString } from '@danieluhm2004/nestjs-tools';

export class BodySendEmailByUserIdInternalDto {
  @IsString({
    description: '사용자 ID',
    example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6',
  })
  userId: string;

  @IsString({
    description: '제목',
    example: '이것은 제목입니다.',
  })
  subject: string;

  @IsString({
    description: '내용',
    example: '이것은 내용입니다.',
  })
  contents: string;

  @IsObject({
    description: '파라미터',
    example: { hello: 'world' },
  })
  fields: any;
}

export class ResSendEmailByUserIdInternalDto {}
