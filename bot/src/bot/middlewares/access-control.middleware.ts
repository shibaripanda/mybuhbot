import { Context, MiddlewareFn } from 'telegraf';
// import { ModuleRef } from '@nestjs/core';
// import { AppService } from '../../app/app.service';
// import { UserService } from '../../user/user.service';
// import { ConfigService } from '@nestjs/config';

export const accessControlMiddleware = (): MiddlewareFn<Context> => {
  return async (ctx, next) => {
    console.log('accessControlMiddleware');
    console.log(ctx.from);
    // const moduleRef: ModuleRef = ctx.state.moduleRef;

    // if (ctx.chat?.type !== 'private') {
    //   const config = moduleRef.get(ConfigService, { strict: false });
    //   console.log(
    //     ctx.chat,
    //     ctx.chat?.id ===
    //       Number(config.get<number>('GROUP_TELEGRAM_CLOSE_PROOF')!),
    //   );
    //   if (
    //     ctx.chat?.id !==
    //     Number(config.get<number>('GROUP_TELEGRAM_CLOSE_PROOF')!)
    //   ) {
    //     console.log('stop');
    //     return;
    //   }
    // }

    // // Проверяем, что сообщение не от бота
    // if (ctx.from?.is_bot) {
    //   return;
    // }

    // const userService = moduleRef.get(UserService, { strict: false });
    // const appService = moduleRef.get(AppService, { strict: false });

    // const userId = ctx.from?.id;
    // const blackListUsers = await appService.getBunUsers();

    // if (!userId || blackListUsers?.includes(userId)) {
    //   console.log(userId, 'In black list');
    //   return;
    // }
    // await userService.upActivity(userId);
    await next();
  };
};
