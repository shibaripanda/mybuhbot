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
import { BotLifecycleService } from './bot.lifecycle.service';
import { BotKeyboardService } from './bot.keyboard.service';
import { BotTextService } from './bot.text.service';
import { KafkaModule } from 'src/kafka/kafka.module';

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
    KafkaModule,
    OpenaiModule,
  ],
  providers: [
    BotService,
    TelegramGateway,
    BotLifecycleService,
    BotKeyboardService,
    BotTextService,
  ],
  exports: [BotService],
})
export class BotModule {}
