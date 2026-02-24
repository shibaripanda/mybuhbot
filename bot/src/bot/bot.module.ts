import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { TelegrafModule } from 'nestjs-telegraf';
import { accessControlMiddleware } from './middlewares/access-control.middleware';
import { Context } from 'telegraf';
import { Update } from '@telegraf/types';
import { TelegramGateway } from './bot.telegram.gateway';
import { BotService } from './bot.service';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [],
      inject: [ConfigService, ModuleRef],
      useFactory: (config: ConfigService, moduleRef: ModuleRef) => ({
        token: config.get<string>('BOT_TOKEN')!,
        dropPendingUpdates: true,
        middlewares: [
          (ctx: Context<Update>, next) => {
            ctx.state.moduleRef = moduleRef;
            return accessControlMiddleware()(ctx, next);
          },
        ],
      }),
    }),
    OpenaiModule,
  ],
  controllers: [],
  providers: [BotService, TelegramGateway],
  exports: [],
})
export class BotModule {}
