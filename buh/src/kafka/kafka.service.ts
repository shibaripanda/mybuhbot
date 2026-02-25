import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_BUH_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {
    console.log('KafkaBuhService start');
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
