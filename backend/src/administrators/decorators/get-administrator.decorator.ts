import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Administrator } from '../entities/administrator.entity';

export const GetAdministrator = createParamDecorator(
  (_data, ctx: ExecutionContext): Administrator => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
