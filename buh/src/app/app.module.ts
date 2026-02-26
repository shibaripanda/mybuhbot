import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalConfigModule } from 'src/globalConfig/globalConfig.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { OpenaiModule } from 'src/openai/openai.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { AccountModule } from 'src/account/account.module';
import { CheckModule } from 'src/check/check.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_TOKEN')!,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AccountModule,
    CheckModule,
    GlobalConfigModule,
    OpenaiModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
