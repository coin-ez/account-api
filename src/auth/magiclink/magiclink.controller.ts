import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  Body,
  NTApiResponse,
  Post,
} from '@danieluhm2004/nestjs-tools';
import { Controller } from '@nestjs/common';
import {
  EmailSendBodyDto,
  EmailSendResponseDto,
  EmailVerifyBodyDto,
  EmailVerifyResponseDto,
} from './magiclink.dto';
import { MagiclinkService } from './magiclink.service';

@ApiBearerAuth()
@ApiTags('Auth / Email')
@Controller({ path: 'auth/email', version: '1' })
export class EmailController {
  constructor(private readonly service: MagiclinkService) {}

  @Post('send')
  @NTApiResponse(EmailSendResponseDto)
  @ApiOperation({ summary: '매직링크 인증을 발송합니다.' })
  async find(@Body() body: EmailSendBodyDto) {
    const res = new EmailSendResponseDto();
    await this.service.create(body);
    return res;
  }

  @Post('verify')
  @NTApiResponse(EmailVerifyResponseDto)
  @ApiOperation({ summary: '매직링크를 인증을 검증합니다.' })
  async findOne(@Body() body: EmailVerifyBodyDto) {
    const res = new EmailVerifyResponseDto();
    const magiclink = await this.service.verify(body);
    res.magiclinkId = magiclink.magiclinkId;
    return res;
  }
}
