import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_BUH_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>('KAFKA_CLIENT_ID')!,
              brokers: [configService.get<string>('KAFKA_BROKER')!],
              // retry: {
              //   initialRetryTime: 3000,
              //   retries: 20,
              // },
            },
            consumer: {
              groupId: configService.get<string>('KAFKA_GROUP_ID')!,
              allowAutoTopicCreation: true,
              autoCommit: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
