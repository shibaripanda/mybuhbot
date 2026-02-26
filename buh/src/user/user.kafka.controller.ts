import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TelegramUser } from './interfaces/TelegramUser';

@Controller()
export class UserKafkaController {
  constructor(private userService: UserService) {}

  @MessagePattern('getUserByTelegramUser')
  async getUserByTelegramUser(@Payload() value: TelegramUser) {
    console.log(value);
    const res = await this.userService.getNewOrExistUser(value);
    return {
      value: { user: res },
      key: 'getUserByTelegramUser',
    };
  }
}
