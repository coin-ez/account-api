import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';

import { NTApiResponse } from '@danieluhm2004/nestjs-tools';
import { ApiExcludeController, ApiOperation } from '@nestjs/swagger';
import { BodyInternalDto, ResInternalDto } from './dto/internal.dto';
import { InternalService } from './internal.service';

@ApiExcludeController()
@SerializeOptions({ groups: ['controller:internal'] })
@Controller({ path: 'internal', version: '1' })
export class InternalController {
  constructor(private readonly internalService: InternalService) {}

  @Post()
  @ApiOperation({ summary: '내부 시스템' })
  @NTApiResponse(ResInternalDto)
  async request(@Body() body: BodyInternalDto): Promise<ResInternalDto> {
    const res = new ResInternalDto();
    res.payload = await this.internalService.request(body);
    return res;
  }
}
