import { Injectable, NestMiddleware } from '@nestjs/common';

import _ from 'lodash';
import { Opcode } from '../common/opcode';
import { SessionService } from './session/session.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly sessionService: SessionService) {}

  async use(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) throw Opcode.LoginRequired();
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer') throw Opcode.LoginRequired();
    const session = await this.sessionService.findOneByToken(token);
    _.set(req, 'properties.current.session', session);
    next();
  }
}

@Injectable()
export class LooseAuthMiddleware implements NestMiddleware {
  constructor(private readonly sessionService: SessionService) {}

  async use(req, res, next) {
    const { authorization } = req.headers;
    if (authorization) {
      const [type, token] = authorization.split(' ');
      if (type === 'Bearer') {
        const session = await this.sessionService.findOneByToken(token);
        _.set(req, 'properties.current.session', session);
      }
    }

    next();
  }
}
