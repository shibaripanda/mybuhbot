import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import axios, { AxiosResponse } from 'axios';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class BotService {
  constructor(@InjectBot() private bot: Telegraf) {}

  async sendMessageReply(
    chatId: number,
    text: string,
    keyboard?: InlineKeyboardButton[][],
  ): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, text, {
      reply_markup: keyboard && { inline_keyboard: keyboard },
    });
  }

  async getVoiceBuffer(file_id: string) {
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
