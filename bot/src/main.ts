import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT');
  const SERVICE_NAME = configService.get<number>('SERVICE_NAME');
  const KAFKA_BROKER = configService.get<string>('KAFKA_BROKER');
  const KAFKA_GROUP_ID = configService.get<string>('KAFKA_GROUP_ID');

  if (!SERVICE_NAME) {
    throw new Error('SERVICE_NAME not set');
  }

  if (!PORT || !KAFKA_BROKER || !KAFKA_GROUP_ID) {
    throw new Error(`${SERVICE_NAME}: SOME_ENV_KEY not set`);
  }

  try {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [KAFKA_BROKER],
          retry: {
            initialRetryTime: 3000,
            retries: 20,
          },
        },
        consumer: {
          groupId: 'Lisener ' + KAFKA_GROUP_ID,
        },
      },
    });
    await app.startAllMicroservices();
  } catch (error) {
    console.log(error);
  }
  await app.listen(PORT);
  process.once('SIGINT', () => void app.close());
  process.once('SIGTERM', () => void app.close());
  console.log(`${SERVICE_NAME} started on port ${PORT}`);
}

void bootstrap();
