import { Module } from '@nestjs/common';
import { GlobalConfigModule } from 'src/globalConfig/globalConfig.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [GlobalConfigModule, OpenaiModule, KafkaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
