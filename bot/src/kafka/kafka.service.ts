import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Account, ServerUser } from 'src/bot/interfaces/User';

interface FromServer {
  user?: ServerUser;
  status?: boolean;
  accounts?: Account[];
}

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_BOT_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {
    console.log('KafkaBotService start');
  }

  onModuleInit() {
    const user = [
      'getUserByTelegramUser',
      'getSimpleUserByTelegramUser',
      'getUserIdByTelegramUser',
    ];
    const biznes = ['createNewCategory', 'createNewCheck', 'getMyAccounts'];
    const patterns = [...user, ...biznes];

    patterns.forEach((p) => this.kafkaClient.subscribeToResponseOf(p));
  }

  kafkaRequest(message: string, data: object | string) {
    return firstValueFrom<FromServer>(
      this.kafkaClient.send(message, {
        value: data,
        key: message,
      }),
    );
  }
}
