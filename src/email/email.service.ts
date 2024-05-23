import { Injectable, Logger } from '@nestjs/common';

import _ from 'lodash';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  // private readonly transporter = createTransport({
  //   service: 'gmail',
  //   host: _.get(EVM, 'SMTP_HOST'),
  //   port: _.parseInt(_.get(process.env, 'SMTP_PORT', '465')),
  //   secure: _.get(EVM, 'SMTP_SECURE', 'false') === 'true',
  //   auth: {
  //     user: _.get(EVM, 'SMTP_USERNAME'),
  //     pass: _.get(EVM, 'SMTP_PASSWORD'),
  //   },
  // });

  // private readonly liquid = new Liquid({
  //   root: 'templates',
  //   extname: '.liquid',
  // });

  async send(
    to: string,
    options: { subject: string; contents: string; fields: any },
  ): Promise<void> {
    this.logger.log(`${to} 이메일을 발송합니다. ${JSON.stringify(options)}`);
    // const { subject, contents, fields } = options;
    // const html = await this.liquid.parseAndRender(contents, fields);
    // const from = _.get(process.env, 'SMTP_FROM');
    // await this.transporter.sendMail({ to, from, subject, html });
  }

  async sendByTemplate(
    to: string,
    options: { subject: string; template: string; fields: any },
  ): Promise<void> {
    this.logger.log(`${to} 이메일을 발송합니다. ${JSON.stringify(options)}`);
    // const { subject, template, fields } = options;
    // const html = await this.liquid.renderFile(template, fields);
    // const from = _.get(process.env, 'SMTP_FROM');
    // await this.transporter.sendMail({ to, from, subject, html });
  }

  async sendAuthChangeEmail(to: string, token: string): Promise<void> {
    token = encodeURIComponent(token);
    const endpoint = _.get(process.env, 'FE_ENDPOINT');
    await this.sendByTemplate(to, {
      subject: '코인이지 / 이메일 변경 인증메일',
      template: 'AuthChangeEmail',
      fields: {
        url: `${endpoint}/auth/magiclink/change-email?token=${token}`,
      },
    });
  }

  async sendAuthSignup(to: string, token: string): Promise<void> {
    token = encodeURIComponent(token);
    const endpoint = _.get(process.env, 'FE_ENDPOINT');
    await this.sendByTemplate(to, {
      subject: '코인이지 / 회원가입 인증메일',
      template: 'AuthSignup',
      fields: {
        url: `${endpoint}/auth/magiclink/signup?token=${token}`,
      },
    });
  }

  async sendAuthReset(to: string, token: string): Promise<void> {
    token = encodeURIComponent(token);
    const endpoint = _.get(process.env, 'FE_ENDPOINT');
    await this.sendByTemplate(to, {
      subject: '코인이지 / 비밀번호 재설정 인증메일',
      template: 'AuthReset',
      fields: {
        url: `${endpoint}/auth/magiclink/reset?token=${token}`,
      },
    });
  }
}
