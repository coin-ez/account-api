import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { Opcode } from '../common/opcode';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { PhoneService } from './phone/phone.service';
import { Session } from './session/session.entity';
import { SessionService } from './session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly phoneService: PhoneService,
  ) {}

  async signup(data: {
    name?: string;
    phoneId: string;
    password?: string;
    marketing?: boolean;
  }) {
    const { name, phoneId, password, marketing } = data;
    const phone = await this.phoneService.lookup(phoneId);

    const { phoneNum } = phone;
    const user = await this.userService.create({
      name,
      phoneNum,
      password,
      marketing,
    });

    await this.phoneService.revoke(phone);
    return user;
  }

  async update(
    user: User,
    data: {
      name?: string;
      phoneId?: string;
      email?: string;
      marketing?: boolean;
      profileUrl?: string;
      password?: string;
    },
  ): Promise<User> {
    const updates: Partial<User> = _.omit(data, 'phoneId');
    if (data.phoneId) {
      const phone = await this.phoneService.lookup(data.phoneId);
      updates.phoneNum = phone.phoneNum;
      await this.phoneService.revoke(phone);
    }

    return this.userService.update(user, updates);
  }

  async loginWithPhone(data: { phoneId: string }): Promise<User> {
    const phone = await this.phoneService.lookup(data.phoneId);
    const user = await this.userService.findOneByPhoneNum(phone.phoneNum);
    if (!user) throw Opcode.CannotFindUser();
    await this.phoneService.revoke(phone);
    return user;
  }

  async loginWithPassword(data: { phoneNum: string; password: string }) {
    const { phoneNum, password } = data;
    const user = await this.userService.findOneByPhoneNum(phoneNum);
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
