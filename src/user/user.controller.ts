import {
  ApiOperation,
  ApiParam,
  ApiTags,
  Body,
  Delete,
  Get,
  NTApiResponse,
  NTPropertyParam,
  Post,
  Query,
} from '@danieluhm2004/nestjs-tools';
import { Controller } from '@nestjs/common';
import { IsAdmin } from '../auth/auth.decorator';
import {
  UserCreateBodyDto,
  UserCreateResponseDto,
  UserDeleteResponseDto,
  UserFindOneResponseDto,
  UserFindQueryDto,
  UserFindResponseDto,
  UserUpdateBodyDto,
  UserUpdateResponseDto,
} from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { TronService } from 'src/tron/tron.service';

@IsAdmin()
@ApiTags('User')
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly service: UserService)  {}

  @Get()
  @NTApiResponse(UserFindResponseDto)
  @ApiOperation({ summary: '사용자 목록을 조회합니다.' })
  async find(@Query() query: UserFindQueryDto) {
    const res = new UserFindResponseDto();
    const [users, total] = await this.service.find(query);
    res.users = users;
    res.total = total;
    return res;
  }

  @Get(':userId')
  @NTApiResponse(UserFindOneResponseDto)
  @ApiOperation({ summary: '사용자를 조회합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  async findOne(@NTPropertyParam('user') user: User) {
    const res = new UserFindOneResponseDto();
    res.user = user;
    return res;
  }

  @Post()
  @NTApiResponse(UserCreateResponseDto)
  @ApiOperation({ summary: '사용자를 생성합니다.' })
  async create(@Body() body: UserCreateBodyDto) {
    const res = new UserCreateResponseDto();
    res.user = await this.service.create(body);
    return res;
  }

  @Post(':userId')
  @NTApiResponse(UserUpdateResponseDto)
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiOperation({ summary: '사용자를 수정합니다.' })
  async update(
    @NTPropertyParam('user') user: User,
    @Body() body: UserUpdateBodyDto,
  ) {
    const res = new UserUpdateResponseDto();
    res.user = await this.service.update(user, body);
    return res;
  }

  @Delete(':userId')
  @NTApiResponse(UserDeleteResponseDto)
  @ApiOperation({ summary: '사용자를 삭제합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  async delete(@NTPropertyParam('user') user: User) {
    const res = new UserDeleteResponseDto();
    await this.service.delete(user);
    return res;
  }
}
