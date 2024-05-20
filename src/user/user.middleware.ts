import { Injectable, NestMiddleware } from '@nestjs/common';

import _ from 'lodash';
import { Opcode } from '../common/opcode';
import { UserService } from './user.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly service: UserService) {}

  async use(req, res, next) {
    const { userId } = req.params;
    if (!userId) throw Opcode.CannotFindUser();
    const user = await this.service.findOne(userId);
    _.set(req, 'properties.user', user);
    next();
  }
}
