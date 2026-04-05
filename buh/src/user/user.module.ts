import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UserKafkaMessageController } from './user.kafka.message.controller';
import { UserKafkaEventController } from './user.kafka.event.controller';
import { AccountModule } from 'src/account/account.module';
import { CheckModule } from 'src/check/check.module';

@Module({
  imports: [
    AccountModule,
    CheckModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserKafkaMessageController, UserKafkaEventController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
