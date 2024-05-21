import { Injectable, NestMiddleware } from '@nestjs/common';

import _ from 'lodash';
import { Opcode } from '../../common/opcode';
import { User } from '../../user/user.entity';
import { SessionService } from './session.service';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly service: SessionService) {}

  async use(req, res, next) {
    const { sessionId } = req.params;
    if (!sessionId) throw Opcode.CannotFindSession();
    const user: User = _.get(req, 'properties.current.session.user');
    if (!user) throw Opcode.CannotFindSession();
    const session = await this.service.findOne(user, sessionId);
    _.set(req, 'properties.session', session);
    next();
  }
}
