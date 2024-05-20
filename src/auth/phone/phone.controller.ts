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
  PhoneSendBodyDto,
  PhoneSendResponseDto,
  PhoneVerifyBodyDto,
  PhoneVerifyResponseDto,
} from './phone.dto';
import { PhoneService } from './phone.service';

@ApiBearerAuth()
@ApiTags('Auth / Phone')
@Controller({ path: 'auth/phone', version: '1' })
export class PhoneController {
  constructor(private readonly service: PhoneService) {}

  @Post('send')
  @NTApiResponse(PhoneSendResponseDto)
  @ApiOperation({ summary: '전화번호 인증을 발송합니다.' })
  async find(@Body() body: PhoneSendBodyDto) {
    const res = new PhoneSendResponseDto();
    await this.service.create(body);
    return res;
  }

  @Post('verify')
  @NTApiResponse(PhoneVerifyResponseDto)
  @ApiOperation({ summary: '전화번호 인증을 검증합니다.' })
  async findOne(@Body() body: PhoneVerifyBodyDto) {
    const res = new PhoneVerifyResponseDto();
    const phone = await this.service.verify(body);
    res.phoneId = phone.phoneId;
    return res;
  }
}
