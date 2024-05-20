import {
  ApiBearerAuth,
  UseGuards,
  applyDecorators,
} from '@danieluhm2004/nestjs-tools';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Request } from 'express';
import _ from 'lodash';
import { AdminGuard } from './auth.guard';

export const IsAdmin = () =>
  applyDecorators(UseGuards(AdminGuard), ApiBearerAuth());
export const AuthorizedUser = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    return _.get(req, `properties.current.session.user`);
  },
);
