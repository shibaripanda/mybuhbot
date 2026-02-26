import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UserKafkaController } from './user.kafka.controller';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [
    AccountModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserKafkaController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
