import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import axios, { AxiosResponse } from 'axios';
import {
  InlineKeyboardButton,
  User as tUser,
} from 'telegraf/typings/core/types/typegram';
import { KafkaService } from 'src/kafka/kafka.service';
import { Expense, OpenaiVoiceService } from 'src/openai/openai.voice.service';
import { ServerUser } from './interfaces/User';

@Injectable()
export class BotService {
  constructor(
    @InjectBot() private bot: Telegraf,
    private readonly kafkaService: KafkaService,
    private openaiVoiceService: OpenaiVoiceService,
  ) {}

  async textMessageProcessing(
    text: string,
    user: ServerUser,
  ): Promise<Expense> {
    const res = await this.openaiVoiceService.textOpenAIProcessing(text, user);
    return res;
  }

  async voiceMessageProcessing(
    voiceFile_id: string,
    user: ServerUser,
  ): Promise<Expense> {
    const voiceBuffer = await this.getVoiceBuffer(voiceFile_id);
    const res = await this.openaiVoiceService.voiceOpenAIProcessing(
      voiceBuffer,
      user,
    );
    return res;
  }

  async getMyAccounts(telegramUser: tUser) {
    const data = await this.kafkaService.kafkaRequest(
      'getMyAccounts',
      telegramUser,
    );
    return data.accounts;
  }

  async getUserId(telegramUser: tUser) {
    const data = await this.kafkaService.kafkaRequest(
      'getUserIdByTelegramUser',
      telegramUser,
    );
    return data.user;
  }

  async getSimpleUser(telegramUser: tUser) {
    const data = await this.kafkaService.kafkaRequest(
      'getSimpleUserByTelegramUser',
      telegramUser,
    );
    return data.user;
  }

  async getUser(telegramUser: tUser) {
    const data = await this.kafkaService.kafkaRequest(
      'getUserByTelegramUser',
      telegramUser,
    );
    return data.user;
  }

  async sendMessageReply(
    chatId: number,
    text: string,
    keyboard?: InlineKeyboardButton[][],
  ): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, text, {
      reply_markup: keyboard && { inline_keyboard: keyboard },
    });
  }

  private async getVoiceBuffer(file_id: string) {
    const flink = await this.getFileLink(file_id);
    return await this.getBuffer(flink);
  }

  private async getFileLink(file_id: string) {
    const fileLink = await this.bot.telegram.getFileLink(file_id);
    return fileLink.href;
  }

  private async getBuffer(link: string): Promise<Buffer> {
    const response: AxiosResponse<ArrayBuffer> = await axios.get(link, {
      responseType: 'arraybuffer',
    });

    return Buffer.from(response.data);
  }
}
