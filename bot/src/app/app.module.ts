import { Module } from '@nestjs/common';
import { BotModule } from 'src/bot/bot.module';
import { GlobalConfigModule } from 'src/globalConfig/globalConfig.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [GlobalConfigModule, BotModule, OpenaiModule, KafkaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
