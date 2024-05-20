import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  Body,
  Get,
  Headers,
  NTApiResponse,
  NTPropertyParam,
  Post,
  SerializeOptions,
} from '@danieluhm2004/nestjs-tools';
import { Controller } from '@nestjs/common';

import { RealIP } from 'nestjs-real-ip';
import { User } from '../user/user.entity';
import { AuthorizedUser } from './auth.decorator';
import {
  AuthGetResponseDto,
  AuthLoginPasswordBodyDto,
  AuthLoginPasswordResponseDto,
  AuthLoginPhoneBodyDto,
  AuthLoginPhoneResponseDto,
  AuthSignupBodyDto,
  AuthSignupResponseDto,
  AuthUpdateBodyDto,
  AuthUpdateResponseDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { Session } from './session/session.entity';

@ApiTags('Auth')
@SerializeOptions({ groups: ['role:me'] })
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get()
  @ApiBearerAuth()
  @NTApiResponse(AuthGetResponseDto)
  @ApiOperation({ summary: '내 정보를 조회합니다.' })
  async get(
    @AuthorizedUser() user: User,
    @NTPropertyParam('current.session') session: Session,
  ) {
    const res = new AuthGetResponseDto();
    res.user = user;
    res.session = session;
    return res;
  }

  @Post()
  @ApiBearerAuth()
  @NTApiResponse(AuthUpdateResponseDto)
  @ApiOperation({ summary: '내 정보를 수정합니다.' })
  async update(@AuthorizedUser() user: User, @Body() body: AuthUpdateBodyDto) {
    const res = new AuthUpdateResponseDto();
    res.user = await this.service.update(user, body);
    return res;
  }

  @Post('signup')
  @NTApiResponse(AuthSignupResponseDto)
  @SerializeOptions({ groups: ['flag:token', 'role:me'] })
  @ApiOperation({ summary: '회원가입을 진행합니다.' })
  async signup(
    @Body() body: AuthSignupBodyDto,
    @Headers('User-Agent') name: string,
    @RealIP() ipAddress: string,
  ) {
    const res = new AuthSignupResponseDto();
    res.user = await this.service.signup(body);
    res.session = await this.service.createSession(res.user, {
      name,
      ipAddress,
    });

    return res;
  }

  @Post('login/magiclink')
  @NTApiResponse(AuthLoginPhoneResponseDto)
  @SerializeOptions({ groups: ['flag:token', 'role:me'] })
  @ApiOperation({ summary: '인증코드로 로그인을 진행합니다.' })
  async loginWithPhone(
    @Body() body: AuthLoginPhoneBodyDto,
    @Headers('User-Agent') name: string,
    @RealIP() ipAddress: string,
  ) {
    const res = new AuthLoginPhoneResponseDto();
    res.user = await this.service.loginWithPhone(body);
    res.session = await this.service.createSession(res.user, {
      name,
      ipAddress,
    });

    return res;
  }

  @Post('login/password')
  @NTApiResponse(AuthLoginPasswordResponseDto)
  @SerializeOptions({ groups: ['flag:token', 'role:me'] })
  @ApiOperation({ summary: '비밀번호로 로그인을 진행합니다.' })
  async loginWithPassword(
    @Body() body: AuthLoginPasswordBodyDto,
    @Headers('User-Agent') name: string,
    @RealIP() ipAddress: string,
  ) {
    const res = new AuthLoginPasswordResponseDto();
    res.user = await this.service.loginWithPassword(body);
    res.session = await this.service.createSession(res.user, {
      name,
      ipAddress,
    });

    return res;
  }
}
