import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_BOT_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {
    console.log('KafkaBotService start');
  }

  onModuleInit() {
    const user = ['getUserByTelegramUser'];
    const patterns = [...user];

    patterns.forEach((p) => this.kafkaClient.subscribeToResponseOf(p));
  }

  kafkaRequest(message: string, data: object | string) {
    return firstValueFrom<boolean | { status: boolean }>(
      this.kafkaClient.send(message, {
        value: data,
        key: message,
      }),
    );
  }
}
