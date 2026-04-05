import { Context, MiddlewareFn } from 'telegraf';
import { ModuleRef } from '@nestjs/core';
import { BotService } from '../bot.service';
import { UserTelegrafContext } from '../interfaces/MyContext';
// import { AppService } from '../../app/app.service';
// import { UserService } from '../../user/user.service';
// import { ConfigService } from '@nestjs/config';

export const accessControlMiddleware = (): MiddlewareFn<Context> => {
  return async (ctx: UserTelegrafContext, next) => {
    console.log('accessControlMiddleware');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const moduleRef: ModuleRef = ctx.state.moduleRef;

    if (ctx.from?.is_bot) return;

    const botService = moduleRef.get(BotService, { strict: false });
    const simpleUser = await botService.getSimpleUser(ctx.from);

    if (!simpleUser) return;

    ctx.simpleUser = simpleUser;

    await next();
  };
};
