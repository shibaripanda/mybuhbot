import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { createReadStream } from 'fs';

interface Expense {
  account: string;
  data: string;
  cost: number;
}

@Injectable()
export class OpenaiVoiceService {
  constructor(@Inject('OPENAI_CLIENT') private readonly openai: OpenAI) {}

  private async transcribe(audioBuffer: Buffer) {
    const filePath = join(tmpdir(), `voice-${Date.now()}.ogg`);
    await writeFile(filePath, audioBuffer);

    try {
      // читаем как stream
      const stream = createReadStream(filePath);

      const transcription = await this.openai.audio.transcriptions.create({
        file: stream, // fs.createReadStream — работает
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

  async getReqData(audioBuffer: Buffer) {
    const text = await this.transcribe(audioBuffer);
    const json = await this.parseExpense(text);
    console.log(json);
    return json;
  }
}
