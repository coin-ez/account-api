import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
  Delete,
  Get,
  NTApiResponse,
  NTPropertyParam,
  Query,
} from '@danieluhm2004/nestjs-tools';
import { Controller } from '@nestjs/common';
import { User } from '../../user/user.entity';
import { AuthorizedUser } from '../auth.decorator';
import {
  SessionDeleteAllResponseDto,
  SessionDeleteResponseDto,
  SessionFindOneResponseDto,
  SessionFindQueryDto,
  SessionFindResponseDto,
} from './session.dto';
import { Session } from './session.entity';
import { SessionService } from './session.service';

@ApiBearerAuth()
@ApiTags('Auth / Session')
@Controller({ path: 'auth/sessions', version: '1' })
export class SessionController {
  constructor(private readonly service: SessionService) {}

  @Get()
  @NTApiResponse(SessionFindResponseDto)
  @ApiOperation({ summary: '세션 목록을 조회합니다.' })
  async find(
    @AuthorizedUser() user: User,
    @Query() query: SessionFindQueryDto,
  ) {
    const res = new SessionFindResponseDto();
    const [sessions, total] = await this.service.find(user, query);
    res.sessions = sessions;
    res.total = total;
    return res;
  }

  @Get(':sessionId')
  @NTApiResponse(SessionFindOneResponseDto)
  @ApiOperation({ summary: '세션을 조회합니다.' })
  @ApiParam({ name: 'sessionId', description: '세션 ID' })
  async findOne(@NTPropertyParam('session') session: Session) {
    const res = new SessionFindOneResponseDto();
    res.session = session;
    return res;
  }

  @Delete(':sessionId')
  @NTApiResponse(SessionDeleteResponseDto)
  @ApiOperation({ summary: '세션을 삭제합니다.' })
  @ApiParam({ name: 'sessionId', description: '세션 ID' })
  async delete(@NTPropertyParam('session') session: Session) {
    const res = new SessionDeleteResponseDto();
    await this.service.delete(session);
    return res;
  }

  @Delete()
  @NTApiResponse(SessionDeleteResponseDto)
  @ApiOperation({ summary: '해당 세션을 로그아웃합니다.' })
  async logout(@NTPropertyParam('current.session') session: Session) {
    const res = new SessionDeleteAllResponseDto();
    await this.service.delete(session);
    return res;
  }

  @Delete('all')
  @NTApiResponse(SessionDeleteAllResponseDto)
  @ApiOperation({ summary: '모든 세션을 삭제합니다.' })
  async deleteAll(@AuthorizedUser() user: User) {
    const res = new SessionDeleteAllResponseDto();
    await this.service.deleteAll(user);
    return res;
  }
}
