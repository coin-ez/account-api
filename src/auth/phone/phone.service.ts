import { InjectRepository, Logger } from '@danieluhm2004/nestjs-tools';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { MoreThan, Repository } from 'typeorm';
import { EVM } from '../../common/evm';
import { Opcode } from '../../common/opcode';
import { Phone } from './phone.entity';

@Injectable()
export class PhoneService {
  private readonly logger = new Logger(PhoneService.name);

  constructor(
    @InjectRepository(Phone)
    private readonly repository: Repository<Phone>,
  ) {}

  async create(data: { phoneNum: string }): Promise<Phone> {
    const { phoneNum } = data;
    await this.throwIfRequestExcess(phoneNum);
    await this.revokeAll(phoneNum);
    const verifyCode = await this.generateVerifyCode();
    const phone = this.repository.create({ phoneNum, verifyCode });
    // const message = `[이벤트몬] 인증번호는 [${verifyCode}] 입니다. (타인 노출 금지)`;

    this.logger.log(
      `${phone.phoneNum} 전화번호 인증을 생성합니다. (${phone.verifyCode})`,
    );
    return phone.save();
  }

  async verify(data: { phoneNum: string; verifyCode: string }): Promise<Phone> {
    const { phoneNum } = data;

    const verifiedAt = null;
    const createdAt = MoreThan(moment().subtract(5, 'minutes').toDate());
    const verifyCode =
      data.verifyCode !== EVM.PHONE_BYPASS_CODE ? data.verifyCode : undefined;

    const phone = await this.repository.findOneBy({
      phoneNum,
      verifyCode,
      createdAt,
      verifiedAt,
    });

    if (!phone) throw Opcode.InvalidVerifyCode();
    phone.verifiedAt = new Date();
    return phone.save();
  }

  async lookup(phoneId: string): Promise<Phone> {
    const verifiedAt = MoreThan(moment().subtract(1, 'hours').toDate());
    const phone = await this.repository.findOneBy({ phoneId, verifiedAt });
    if (!phone) throw Opcode.CannotFindPhone();
    return phone;
  }

  async revoke(phone: Phone): Promise<Phone> {
    phone.expiredAt = new Date();
    return phone.save();
  }

  async revokeAll(phoneNum: string): Promise<void> {
    await this.repository.update({ phoneNum }, { expiredAt: new Date() });
    this.logger.log(`${phoneNum} 전화번호 인증을 모두 만료하였습니다.`);
  }

  async throwIfRequestExcess(phoneNum: string): Promise<void> {
    const verifiedAt = null;
    const createdAt = MoreThan(moment().startOf('day').toDate());
    const count = await this.repository.countBy({
      phoneNum,
      createdAt,
      verifiedAt,
    });

    if (count >= 5) {
      this.logger.log(`${phoneNum} 전화번호 인증을 초과하였습니다.`);
      throw Opcode.ExcessedPhone();
    }
  }

  async generateVerifyCode(): Promise<string> {
    const verifyCode = Math.floor(Math.random() * 1000000).toString();
    return verifyCode.padStart(6, '0');
  }
}
