import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { Opcode } from '../common/opcode';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { EmailService } from './email/email.service';
import { Session } from './session/session.entity';
import { SessionService } from './session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService,
  ) {}

  async signup(data: {
    name?: string;
    emailId: string;
    password?: string;
    marketing?: boolean;
  }) {
    const { name, emailId, password, marketing } = data;
    const email = await this.emailService.lookup(emailId);

    const { emailAddress } = email;
    const user = await this.userService.create({
      name,
      emailAddress,
      password,
      marketing,
    });

    await this.emailService.revoke(email);
    return user;
  }

  async update(
    user: User,
    data: {
      name?: string;
      emailId?: string;
      email?: string;
      marketing?: boolean;
      profileUrl?: string;
      password?: string;
    },
  ): Promise<User> {
    const updates: Partial<User> = _.omit(data, 'emailId');
    if (data.emailId) {
      const email = await this.emailService.lookup(data.emailId);
      updates.emailAddress = email.emailAddress;
      await this.emailService.revoke(email);
    }

    return this.userService.update(user, updates);
  }

  async loginWithEmail(data: { emailId: string }): Promise<User> {
    const email = await this.emailService.lookup(data.emailId);
    const user = await this.userService.findOneByEmailAddress(
      email.emailAddress,
    );

    if (!user) throw Opcode.CannotFindUser();
    await this.emailService.revoke(email);
    return user;
  }

  async loginWithPassword(data: { emailAddress: string; password: string }) {
    const { emailAddress, password } = data;
    const user = await this.userService.findOneByEmailAddress(emailAddress);
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
