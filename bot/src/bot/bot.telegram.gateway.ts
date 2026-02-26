import { UseGuards } from '@nestjs/common';
import { Message, Update as UpdateTelegraf } from '@telegraf/types';
import { Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Context, NarrowedContext } from 'telegraf';
import { AdminAccessGuard } from './guards/access-control.guard';
import { BotService } from './bot.service';
import { BotKeyboardService } from './bot.keyboard.service';
import { BotTextService } from './bot.text.service';
import { OpenaiVoiceService } from 'src/openai/openai.voice.service';

export type UserTelegrafContext = NarrowedContext<
  Context,
  UpdateTelegraf.MessageUpdate & { message: Message.VoiceMessage }
>;

@Update()
export class TelegramGateway {
  constructor(
    private botService: BotService,
    private botKeyboardService: BotKeyboardService,
    private botTextService: BotTextService,
    private openaiVoiceService: OpenaiVoiceService,
  ) {}

  @UseGuards(AdminAccessGuard)
  @Start()
  async start(@Ctx() ctx: UserTelegrafContext) {
    console.log('@Start');
    if (!ctx.from) return;
    console.log(ctx.from);
    const user = await this.botService.getUser(ctx.from);
    console.log(user);
    const keyboard = this.botKeyboardService.keyboardStart();
    const text = this.botTextService.textStart();
    await this.botService.sendMessageReply(ctx.from.id, text, keyboard);
  }

  @On('voice')
  async onVoice(@Ctx() ctx: UserTelegrafContext) {
    const voice = ctx.message['voice'];

    console.log('DURATION:', voice.duration);

    // const voiceBuffer = await this.botService.getVoiceBuffer(voice.file_id);
    const text = await this.openaiVoiceService.voiceProcessingToText(
      voice.file_id,
    );
    console.log(text);
    await this.botService.sendMessageReply(ctx.from.id, JSON.stringify(text));
  }
}
