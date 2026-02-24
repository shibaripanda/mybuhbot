import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_BOT_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {
    console.log('KafkaService start');
  }

  onModuleInit() {
    // await this.kafkaClient.connect();
    this.kafkaClient.subscribeToResponseOf('deleteAccount');
    // await this.kafkaClient.connect();
    // this.kafkaClient.emit('test', {
    //   value: {
    //     message: this.configService.get<string>('SERVICE_NAME'),
    //   },
    //   key: 123,
    // });
  }
}
