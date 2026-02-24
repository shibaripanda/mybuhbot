import { UseGuards } from '@nestjs/common';
import { Message, Update as UpdateTelegraf } from '@telegraf/types';
import { Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Context, NarrowedContext } from 'telegraf';
import { AdminAccessGuard } from './guards/access-control.guard';
import { BotService } from './bot.service';

export type UserTelegrafContext = NarrowedContext<
  Context,
  UpdateTelegraf.MessageUpdate & { message: Message.VoiceMessage }
>;

@Update()
export class TelegramGateway {
  constructor(private botService: BotService) {}

  @UseGuards(AdminAccessGuard)
  @Start()
  start(@Ctx() ctx: UserTelegrafContext) {
    console.log('@Start');
    console.log(ctx.from);
  }

  @On('voice')
  async onVoice(@Ctx() ctx: UserTelegrafContext) {
    const voice = ctx.message['voice'];

    console.log('voice');
    console.log(ctx.from);
    console.log('VOICE FILE ID:', voice.file_id);
    console.log('DURATION:', voice.duration);

    await ctx.reply('Получил голосовое 🎧');
    await this.botService.newAdd(voice.file_id);
  }
}
