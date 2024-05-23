import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { Opcode } from '../common/opcode';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { MagiclinkService } from './magiclink/magiclink.service';
import { Session } from './session/session.entity';
import { SessionService } from './session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly magiclinkService: MagiclinkService,
  ) {}

  async signup(data: {
    name?: string;
    magiclinkId: string;
    password?: string;
    marketing?: boolean;
  }) {
    const { name, magiclinkId, password, marketing } = data;
    const magiclink = await this.magiclinkService.lookup(magiclinkId);

    const { email } = magiclink;
    const user = await this.userService.create({
      name,
      email,
      password,
      marketing,
    });

    await this.magiclinkService.revoke(magiclink);
    return user;
  }

  async update(
    user: User,
    data: {
      name?: string;
      magiclinkId?: string;
      marketing?: boolean;
      profileUrl?: string;
      password?: string;
    },
  ): Promise<User> {
    const updates: Partial<User> = _.omit(data, 'magiclinkId');
    if (data.magiclinkId) {
      const magiclink = await this.magiclinkService.lookup(data.magiclinkId);
      updates.email = magiclink.email;
      await this.magiclinkService.revoke(magiclink);
    }

    return this.userService.update(user, updates);
  }

  async loginWithEmail(data: { magiclinkId: string }): Promise<User> {
    const magiclink = await this.magiclinkService.lookup(data.magiclinkId);
    const user = await this.userService.findOneByEmail(magiclink.email);

    if (!user) throw Opcode.CannotFindUser();
    await this.magiclinkService.revoke(magiclink);
    return user;
  }

  async loginWithPassword(data: { email: string; password: string }) {
    const { email, password } = data;
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw Opcode.PasswordNotMatch();
    const isMatch = await this.userService.comparePassword(user, password);
    if (!isMatch) throw Opcode.PasswordNotMatch();
    return user;
  }

  async createSession(
    user: User,
    data: {
      name: string;
      ipAddress: string;
    },
  ): Promise<Session> {
    return this.sessionService.create(user, data);
  }
}
