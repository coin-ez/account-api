import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import {
  BodyGetUserByAccessTokenInternalDto,
  ResGetUserByAccessTokenInternalDto,
} from './dto/get-user-by-access-token.dto';
import {
  BodyCommonInternalDto,
  BodyInternalDto,
  ResponseInfoInternalDto,
} from './dto/internal.dto';

import { NTAppService } from '@danieluhm2004/nestjs-tools';
import { plainToInstance } from 'class-transformer';
import { validate, validateOrReject } from 'class-validator';
import CryptoJS from 'crypto-js';
import _ from 'lodash';
import moment from 'moment';
import { SessionService } from 'src/auth/session/session.service';
import { EVM } from 'src/common/evm';
import { Opcode } from '../common/opcode';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import {
  BodyGetUserInternalDto,
  ResGetUserInternalDto,
} from './dto/get-user.dto';
import {
  BodySendEmailByUserIdInternalDto,
  ResSendEmailByUserIdInternalDto,
} from './dto/send-email-by-user-id.dto';

@Injectable()
export class InternalService {
  private readonly logger = new Logger(InternalService.name);
  private readonly apiKey = EVM.COINEZ_ACCOUNT_API_KEY;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => SessionService))
    private readonly sessionService: SessionService,
    @Inject(forwardRef(() => NTAppService))
    private readonly appService: NTAppService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
  ) {}

  private readonly functions = {
    getUser: {
      body: BodyGetUserInternalDto,
      res: ResGetUserInternalDto,
    },
    getUserByAccessToken: {
      body: BodyGetUserByAccessTokenInternalDto,
      res: ResGetUserByAccessTokenInternalDto,
    },
    sendEmailByUserId: {
      body: BodySendEmailByUserIdInternalDto,
      res: ResSendEmailByUserIdInternalDto,
    },
  };

  async request(data: BodyInternalDto): Promise<string> {
    const payload = await this.decryptPayload(data.payload);
    const func = this.functions[payload.functionName];
    if (!func) throw Opcode.InternalEncryptError();

    const { functionName, requestInfo, body } = payload;
    const { requestBy } = requestInfo;
    const stringifyBody = JSON.stringify(body);
    const requestedAt = moment(requestInfo.requestedAt);
    if (moment().diff(requestedAt, 'minutes') > 3) {
      throw Opcode.InternalEncryptError();
    }

    this.logger.log(
      `${requestBy}(이)에 의해 ${functionName} 함수가 호출되었습니다. (${stringifyBody})`,
    );

    const parsedData = plainToInstance(func.body, body, {
      enableImplicitConversion: true,
      excludeExtraneousValues: false,
      groups: ['flag:request', 'controller:internal'],
    });

    const details = await validate(parsedData);
    if (details.length > 0) throw Opcode.ValidateFailed({ details });
    const result = await this[payload.functionName](parsedData);
    const encryptResult = this.encryptResult(result);
    return encryptResult;
  }

  async getUser(data: BodyGetUserInternalDto): Promise<ResGetUserInternalDto> {
    const res = new ResGetUserInternalDto();
    res.user = await this.userService.findOne(data.userId);
    return res;
  }

  async getUserByAccessToken(
    data: BodyGetUserByAccessTokenInternalDto,
  ): Promise<ResGetUserByAccessTokenInternalDto> {
    const res = new ResGetUserByAccessTokenInternalDto();
    res.user = await this.sessionService
      .findOneByToken(data.accessToken)
      .then((r) => r.user);
    return res;
  }

  async sendEmailByUserId(
    data: BodySendEmailByUserIdInternalDto,
  ): Promise<ResSendEmailByUserIdInternalDto> {
    const res = new BodySendEmailByUserIdInternalDto();
    const user = await this.userService.findOne(data.userId);
    await this.emailService.send(user.email, _.omit(data, 'userId'));
    return res;
  }

  private async decryptPayload(body: string): Promise<BodyCommonInternalDto> {
    try {
      const result = CryptoJS.AES.decrypt(body, this.apiKey);
      const parsedJson = JSON.parse(result.toString(CryptoJS.enc.Utf8));
      const instance = plainToInstance(BodyCommonInternalDto, parsedJson);
      await validateOrReject(instance);
      return instance;
    } catch (err) {
      this.logger.error(err);
      throw Opcode.InternalEncryptError();
    }
  }

  private encryptResult(body: any): string {
    try {
      const { name, author, hostname } =
        this.appService.getClusterInfoFromCache();
      const responseInfo: ResponseInfoInternalDto = {
        responseBy: `${name} <${author}>(${hostname})`,
        responsedAt: new Date(),
      };

      const resJson = JSON.stringify({ body, responseInfo });
      const result = CryptoJS.AES.encrypt(resJson, this.apiKey);
      return result.toString();
    } catch (err) {
      this.logger.error(err);
      throw Opcode.InternalEncryptError();
    }
  }
}
