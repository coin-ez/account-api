import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@danieluhm2004/nestjs-tools';

import _ from 'lodash';
import { Opcode } from '../common/opcode';
import { User } from '../user/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const user: User = _.get(req.properties, 'current.session.user');
    if (!user.isAdmin) throw Opcode.PermissionRequired();
    return true;
  }
}
