import { UseGuards } from '@nestjs/common';
import { Message, Update as UpdateTelegraf } from '@telegraf/types';
import { Action, Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Context, NarrowedContext } from 'telegraf';
import { AdminAccessGuard } from './guards/access-control.guard';
import { BotService } from './bot.service';
import { BotKeyboardService } from './bot.keyboard.service';
import { BotTextService } from './bot.text.service';
import { ConfigService } from '@nestjs/config';
import { BotBiznesService } from './bot.biznes.service';

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
    private botBiznesService: BotBiznesService,
    private config: ConfigService,
  ) {}

  @UseGuards(AdminAccessGuard)
  @Start()
  async start(@Ctx() ctx: UserTelegrafContext) {
    console.log('@Start');
    if (!ctx.from) return;

    const user = await this.botService.getUser(ctx.from);
    // const simpleUser = await this.botService.getSimpleUser(ctx.from);
    // const userId = await this.botService.getUserId(ctx.from);

    // console.log('UserId', userId);
    // console.log('SimpleUser', simpleUser);
    console.log('User', user);

    // if (!user) return;

    const keyboard = this.botKeyboardService.keyboardStart();
    const text = this.botTextService.textStart();
    await this.botService.sendMessageReply(ctx.from.id, text, keyboard);
  }

  @Action('myAccounts')
  async myAccounts(@Ctx() ctx: UserTelegrafContext) {
    console.log('myAccounts');
    const myAccounts = await this.botService.getMyAccounts(ctx.from);
    if (!myAccounts) return;
    const { text, keyboard } = this.botBiznesService.myAccounts(myAccounts);
    await this.botService.sendMessageReply(ctx.from.id, text, keyboard);
  }

  @Action('mainMenu')
  async mainMenu(@Ctx() ctx: UserTelegrafContext) {
    console.log('mainMenu');
    const text = this.botTextService.textMainMenu();
    const keyboard = this.botKeyboardService.keyboardMainMenu();
    await this.botService.sendMessageReply(ctx.from.id, text, keyboard);
  }

  @On('text')
  async onText(@Ctx() ctx: UserTelegrafContext) {
    const message = ctx.message as Message.TextMessage;
    const maxLengthTextMessage = Number(
      this.config.get<string>('MAX_LENGTH_TEXT_MESSAGE')!,
    );
    console.log('DURATION:', message.text.length, '/', maxLengthTextMessage);

    const user = await this.botService.getUser(ctx.from);
    if (!user) return;
    if (message.text.length > maxLengthTextMessage) {
      await this.botService.sendMessageReply(
        ctx.from.id,
        `Alert, too long text message\nMax length: ${maxLengthTextMessage}`,
      );
      return;
    }
    const res = await this.botService.textMessageProcessing(message.text, user);
    console.log(res);
    const { text, keyboard } = await this.botBiznesService.biznesStep(
      res,
      user,
    );
    await this.botService.sendMessageReply(ctx.from.id, text, keyboard);
  }

  @On('voice')
  async onVoice(@Ctx() ctx: UserTelegrafContext) {
    const voice = ctx.message['voice'];
    const maxLengthVoiceMessage = Number(
      this.config.get<string>('MAX_LENGTH_VOICE_MESSAGE_SECONDS')!,
    );
    console.log('DURATION:', voice.duration, '/', maxLengthVoiceMessage);

    const user = await this.botService.getUser(ctx.from);
    if (!user) return;
    if (voice.duration > maxLengthVoiceMessage) {
      await this.botService.sendMessageReply(
        ctx.from.id,
        `Alert, too long voice message\nMax length: ${maxLengthVoiceMessage} seconds`,
      );
      return;
    }
    const res = await this.botService.voiceMessageProcessing(
      voice.file_id,
      user,
    );
    console.log(res);
    const { text, keyboard } = await this.botBiznesService.biznesStep(
      res,
      user,
    );
    // console.log(text, keyboard);
    await this.botService.sendMessageReply(ctx.from.id, text, keyboard);
  }
}
