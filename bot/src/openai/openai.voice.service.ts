import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { createReadStream } from 'fs';
import { BotService } from 'src/bot/bot.service';

interface Expense {
  account: string;
  data: string;
  cost: number;
}

@Injectable()
export class OpenaiVoiceService {
  constructor(
    @Inject('OPENAI_CLIENT') private readonly openai: OpenAI,
    private botService: BotService,
  ) {}

  private async transcribe(audioBuffer: Buffer) {
    const filePath = join(tmpdir(), `voice-${Date.now()}.ogg`);
    await writeFile(filePath, audioBuffer);

    try {
      const stream = createReadStream(filePath);

      const transcription = await this.openai.audio.transcriptions.create({
        file: stream,
        model: 'gpt-4o-transcribe',
      });

      return transcription.text;
    } finally {
      await unlink(filePath).catch(() => {});
    }
  }

  private async parseExpense(text: string): Promise<Expense> {
    const res = await this.openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        {
          role: 'system',
          content:
            'Ты парсер голосовых финансовых записей. Отвечай строго JSON в формате {"account":"", "data":"", "cost":0}',
        },
        { role: 'user', content: text },
      ],
      temperature: 0,
    });

    const jsonText = res.choices?.[0]?.message?.content ?? '{}';

    // Приводим к типу Expense
    return JSON.parse(jsonText) as Expense;
  }

  private async openaiReqest(request: string, content: string) {
    const res = await this.openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        {
          role: 'system',
          content: request,
        },
        { role: 'user', content: content },
      ],
      temperature: 0,
    });
    const jsonText = res.choices?.[0]?.message?.content ?? '{}';
    return JSON.parse(jsonText) as Expense;
  }

  // private async choosingNextStep(text: string): Promise<Expense> {
  //   const res = await this.openaiReqest(
  //     'Ты парсер голосовых финансовых записей. Отвечай строго JSON в формате {"account":"", "data":"", "cost":0}',
  //     text,
  //   );
  //   return res;
  // }

  private async choosingNextStep(
    text: string,
    accounts: string[],
  ): Promise<Expense> {
    const accString = accounts.length
      ? accounts.join(', ')
      : 'У человека еще нет статьей расходов';
    const res = await this.openaiReqest(
      `Существующие статьи расходов данного человека: ${accString},
      Что скорее всего имеет ввиду и хочет человек:
      
      1.Добавить одну или несколько статей расходов (только если не существуют, существующие игнорируй в ответе)?
      ({step: 1, data: {"newAccounts":["название аккаунта 1", "название аккаунта 2", "название аккаунта 3"]}}),

      2.Добавить расходы в уже существующую статью/статьи, если статьи не указаны явно - выбери наиболее подходящие из существующих (только существующие, несуществующие игнорируй в ответе)?
      ({step: 2, data: [{"account":"статья расходов", "info":"подробности", "cost": стоимость}]}), 
      
      3.Хочет узнать сумму расходов по статье/статьям (только существующие, несуществующие игнорируй в ответе)? 
      ({step: 3, data: {"account":["название аккаунта 1", "название аккаунта 2"]}}),

      4.Хочет удалить одну или несколько статей (удалить можно только существующую статью/статьи, несуществующие игнорируй в ответе)?
      ({step: 4, data: {"account":["название аккаунта 1", "название аккаунта 2", "название аккаунта 3"]}}),

      5.Хочет узнать свой баланс? 
      ({step: 5}),

      0 если непонятно. 
      ({step: 0}).
      
      Ты парсер голосовых финансовых записей, Отвечай строго JSON в формате исходя из примеров`,
      text,
    );
    return res;
  }

  async voiceProcessingToText(voice_id: string) {
    const voiceBuffer = await this.botService.getVoiceBuffer(voice_id);
    const text = await this.transcribe(voiceBuffer);
    const accounts = ['еда', 'отдых', 'такси'];
    const res = await this.choosingNextStep(text, accounts);
    return res;
  }
}
