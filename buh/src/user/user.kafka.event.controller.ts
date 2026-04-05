import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern, Payload } from '@nestjs/microservices';

export interface UpdateLastMessage {
  t_Id: number;
  lastMessageId: number;
}

@Controller()
export class UserKafkaEventController {
  constructor(private userService: UserService) {}

  @EventPattern('updateLastMessageId')
  async updateLastMessageId(@Payload() data: UpdateLastMessage) {
    await this.userService.updateLastMessageId(data.t_Id, data.lastMessageId);
  }
}
