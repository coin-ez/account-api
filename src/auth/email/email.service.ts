import { InjectRepository, Logger } from '@danieluhm2004/nestjs-tools';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { MoreThan, Repository } from 'typeorm';
import { EVM } from '../../common/evm';
import { Opcode } from '../../common/opcode';
import { Email } from './email.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @InjectRepository(Email)
    private readonly repository: Repository<Email>,
  ) {}

  async create(data: { emailAddress: string }): Promise<Email> {
    const { emailAddress } = data;
    await this.throwIfRequestExcess(emailAddress);
    await this.revokeAll(emailAddress);
    const verifyCode = await this.generateVerifyCode();
    const email = this.repository.create({ emailAddress, verifyCode });
    // TODO: Send email

    this.logger.log(
      `${email.emailAddress} 이메일 인증을 생성합니다. (${email.verifyCode})`,
    );
    return email.save();
  }

  async verify(data: {
    emailAddress: string;
    verifyCode: string;
  }): Promise<Email> {
    const { emailAddress } = data;

    const verifiedAt = null;
    const createdAt = MoreThan(moment().subtract(5, 'minutes').toDate());
    const verifyCode =
      data.verifyCode !== EVM.EMAIL_BYPASS_CODE ? data.verifyCode : undefined;

    const email = await this.repository.findOneBy({
      emailAddress,
      verifyCode,
      createdAt,
      verifiedAt,
    });

    if (!email) throw Opcode.InvalidVerifyCode();
    email.verifiedAt = new Date();
    return email.save();
  }

  async lookup(emailId: string): Promise<Email> {
    const verifiedAt = MoreThan(moment().subtract(1, 'hours').toDate());
    const email = await this.repository.findOneBy({ emailId, verifiedAt });
    if (!email) throw Opcode.CannotFindEmail();
    return email;
  }

  async revoke(email: Email): Promise<Email> {
    email.expiredAt = new Date();
    return email.save();
  }

  async revokeAll(emailAddress: string): Promise<void> {
    await this.repository.update({ emailAddress }, { expiredAt: new Date() });
    this.logger.log(`${emailAddress} 이메일 인증을 모두 만료하였습니다.`);
  }

  async throwIfRequestExcess(emailAddress: string): Promise<void> {
    const verifiedAt = null;
    const createdAt = MoreThan(moment().startOf('day').toDate());
    const count = await this.repository.countBy({
      emailAddress,
      createdAt,
      verifiedAt,
    });

    if (count >= 5) {
      this.logger.log(`${emailAddress} 이메일 인증을 초과하였습니다.`);
      throw Opcode.ExcessedEmail();
    }
  }

  async generateVerifyCode(): Promise<string> {
    const verifyCode = Math.floor(Math.random() * 1000000).toString();
    return verifyCode.padStart(6, '0');
  }
}
