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
} from './email.dto';
import { EmailService } from './email.service';

@ApiBearerAuth()
@ApiTags('Auth / Email')
@Controller({ path: 'auth/email', version: '1' })
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @Post('send')
  @NTApiResponse(EmailSendResponseDto)
  @ApiOperation({ summary: '이메일 인증을 발송합니다.' })
  async find(@Body() body: EmailSendBodyDto) {
    const res = new EmailSendResponseDto();
    await this.service.create(body);
    return res;
  }

  @Post('verify')
  @NTApiResponse(EmailVerifyResponseDto)
  @ApiOperation({ summary: '이메일 인증을 검증합니다.' })
  async findOne(@Body() body: EmailVerifyBodyDto) {
    const res = new EmailVerifyResponseDto();
    const email = await this.service.verify(body);
    res.emailId = email.emailId;
    return res;
  }
}
