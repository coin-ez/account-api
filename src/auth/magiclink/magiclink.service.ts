import { InjectRepository, Logger } from '@danieluhm2004/nestjs-tools';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { MoreThan, Repository } from 'typeorm';
import { EVM } from '../../common/evm';
import { Opcode } from '../../common/opcode';
import { Magiclink } from './magiclink.entity';

@Injectable()
export class MagiclinkService {
  private readonly logger = new Logger(MagiclinkService.name);

  constructor(
    @InjectRepository(Magiclink)
    private readonly repository: Repository<Magiclink>,
  ) {}

  async create(data: { email: string }): Promise<Magiclink> {
    const { email } = data;
    await this.throwIfRequestExcess(email);
    await this.revokeAll(email);
    const verifyCode = await this.generateVerifyCode();
    const magiclink = this.repository.create({ email, verifyCode });
    // TODO: Send email

    this.logger.log(
      `${magiclink.email} 이메일 인증을 생성합니다. (${magiclink.verifyCode})`,
    );

    return magiclink.save();
  }

  async verify(data: {
    email: string;
    verifyCode: string;
  }): Promise<Magiclink> {
    const { email } = data;

    const verifiedAt = null;
    const createdAt = MoreThan(moment().subtract(5, 'minutes').toDate());
    const verifyCode =
      data.verifyCode !== EVM.MAGICLINK_BYPASS_CODE
        ? data.verifyCode
        : undefined;

    const magiclink = await this.repository.findOneBy({
      email,
      verifyCode,
      createdAt,
      verifiedAt,
    });

    if (!magiclink) throw Opcode.InvalidVerifyCode();
    magiclink.verifiedAt = new Date();
    return magiclink.save();
  }

  async lookup(magiclinkId: string): Promise<Magiclink> {
    const verifiedAt = MoreThan(moment().subtract(1, 'hours').toDate());
    const magiclink = await this.repository.findOneBy({
      magiclinkId,
      verifiedAt,
    });

    if (!magiclink) throw Opcode.CannotFindEmail();
    return magiclink;
  }

  async revoke(email: Magiclink): Promise<Magiclink> {
    email.expiredAt = new Date();
    return email.save();
  }

  async revokeAll(email: string): Promise<void> {
    await this.repository.update({ email }, { expiredAt: new Date() });
    this.logger.log(`${email} 이메일 인증을 모두 만료하였습니다.`);
  }

  async throwIfRequestExcess(email: string): Promise<void> {
    const verifiedAt = null;
    const createdAt = MoreThan(moment().startOf('day').toDate());
    const count = await this.repository.countBy({
      email,
      createdAt,
      verifiedAt,
    });

    if (count >= 5) {
      this.logger.log(`${email} 이메일 인증을 초과하였습니다.`);
      throw Opcode.ExcessedEmail();
    }
  }

  async generateVerifyCode(): Promise<string> {
    const verifyCode = Math.floor(Math.random() * 1000000).toString();
    return verifyCode.padStart(6, '0');
  }
}
