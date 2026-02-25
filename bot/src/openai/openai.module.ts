import { forwardRef, Module } from '@nestjs/common';
import { OpenAIProvider } from './openai.provider';
import { OpenaiVoiceService } from './openai.voice.service';
import { BotModule } from 'src/bot/bot.module';

@Module({
  imports: [forwardRef(() => BotModule)],
  providers: [OpenAIProvider, OpenaiVoiceService],
  exports: [OpenaiVoiceService],
})
export class OpenaiModule {}
