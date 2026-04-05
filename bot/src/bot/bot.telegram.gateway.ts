// import { UseGuards } from '@nestjs/common';
import { Message } from '@telegraf/types';
import { Action, Ctx, On, Start, Update } from 'nestjs-telegraf';
// import { AdminAccessGuard } from './guards/access-control.guard';
import { BotService } from './bot.service';
import { BotKeyboardService } from './bot.keyboard.service';
import { BotTextService } from './bot.text.service';
import { ConfigService } from '@nestjs/config';
import { BotBiznesService } from './bot.biznes.service';
import { UserTelegrafContext } from './interfaces/MyContext';

@Update()
export class TelegramGateway {
  constructor(
    private botService: BotService,
    private botKeyboardService: BotKeyboardService,
    private botTextService: BotTextService,
    private botBiznesService: BotBiznesService,
    private config: ConfigService,
  ) {}

  // @UseGuards(AdminAccessGuard)
  @Start()
  async start(@Ctx() ctx: UserTelegrafContext) {
    console.log('@Start');
    await ctx.sendChatAction('typing');

    // const user = await this.botService.getUser(ctx.from);
    // const simpleUser = await this.botService.getSimpleUser(ctx.from);
    // const userId = await this.botService.getUserId(ctx.from);

    // console.log('UserId', userId);
    // console.log('SimpleUser', simpleUser);
    // console.log('User', user);

    const keyboard = this.botKeyboardService.keyboardStart();
    const text = this.botTextService.textStart();
    await this.botService.sendMessageReply(ctx, text, keyboard);
  }

  @Action('myAccounts')
  async myAccounts(@Ctx() ctx: UserTelegrafContext) {
    console.log('myAccounts');
    await ctx.answerCbQuery();
    await ctx.sendChatAction('typing');
    const myAccounts = await this.botService.getMyAccounts(ctx.from);
    if (!myAccounts) return;
    const { text, keyboard } = this.botBiznesService.myAccounts(myAccounts);
    await this.botService.sendMessageReply(ctx, text, keyboard);
  }

  @Action('mainMenu')
  async mainMenu(@Ctx() ctx: UserTelegrafContext) {
    console.log('mainMenu');
    await ctx.answerCbQuery();
    await ctx.sendChatAction('typing');
    const text = this.botTextService.textMainMenu();
    const keyboard = this.botKeyboardService.keyboardMainMenu();
    await this.botService.sendMessageReply(ctx, text, keyboard);
  }

  @On('text')
  async onText(@Ctx() ctx: UserTelegrafContext) {
    await ctx.sendChatAction('typing');
    const message = ctx.message as Message.TextMessage;
    const maxLengthTextMessage = Number(
      this.config.get<string>('MAX_LENGTH_TEXT_MESSAGE')!,
    );
    console.log('DURATION:', message.text.length, '/', maxLengthTextMessage);

    const user = await this.botService.getUserSimpleAccounts(ctx.from);
    if (!user) return;
    if (message.text.length > maxLengthTextMessage) {
      await this.botService.sendMessageReply(
        ctx,
        `Alert, too long text message\nMax length: ${maxLengthTextMessage}`,
      );
      return;
    }
    const res = await this.botService.textMessageProcessing(message.text, user);
    const { text, keyboard } = await this.botBiznesService.biznesStep(
      res,
      user,
    );
    await this.botService.sendMessageReply(ctx, text, keyboard);
  }

  @On('voice')
  async onVoice(@Ctx() ctx: UserTelegrafContext) {
    await ctx.sendChatAction('typing');
    const voice = ctx.message['voice'];
    const maxLengthVoiceMessage = Number(
      this.config.get<string>('MAX_LENGTH_VOICE_MESSAGE_SECONDS')!,
    );
    console.log('DURATION:', voice.duration, '/', maxLengthVoiceMessage);

    const user = await this.botService.getUserSimpleAccounts(ctx.from);
    if (!user) return;
    if (voice.duration > maxLengthVoiceMessage) {
      await this.botService.sendMessageReply(
        ctx,
        `Alert, too long voice message\nMax length: ${maxLengthVoiceMessage} seconds`,
      );
      return;
    }
    const res = await this.botService.voiceMessageProcessing(
      voice.file_id,
      user,
    );
    const { text, keyboard } = await this.botBiznesService.biznesStep(
      res,
      user,
    );
    await this.botService.sendMessageReply(ctx, text, keyboard);
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: UserTelegrafContext) {
    const message = ctx.message as Message.PhotoMessage;

    // const link = await ctx.telegram.getFileLink(message.photo[0].file_id);
    // const res = await fetch(link.href);
    // const buffer = Buffer.from(await res.arrayBuffer());

    const user = await this.botService.getUserSimpleAccounts(ctx.from);
    if (!user) return;

    const res = await this.botService.photoMessageProcessing(
      message.photo[0].file_id,
      user,
    );

    const { text, keyboard } = await this.botBiznesService.biznesStep(
      res,
      user,
    );
    await this.botService.sendMessageReply(ctx, text, keyboard);
  }
}
