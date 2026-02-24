import { Injectable } from '@nestjs/common';
import { OpenaiVoiceService } from 'src/openai/openai.voice.service';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class BotService {
  constructor(
    private openaiVoiceService: OpenaiVoiceService,
    @InjectBot() private bot: Telegraf,
  ) {}

  async newAdd(file_id: string) {
    const flink = await this.getFileLink(file_id);
    const buffer = await this.getBuffer(flink);
    const res = await this.openaiVoiceService.getReqData(buffer);
    console.log(res);
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
