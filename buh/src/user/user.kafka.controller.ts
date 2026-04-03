import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TelegramUser } from './interfaces/TelegramUser';
import { Types } from 'mongoose';

export interface NewCheck {
  account: string;
  info: string;
  cost: number;
  account_id: Types.ObjectId;
}

@Controller()
export class UserKafkaController {
  constructor(private userService: UserService) {}

  @MessagePattern('getMyAccounts')
  async getMyAccounts(@Payload() value: TelegramUser) {
    const res = await this.userService.getMyAccounts(value);
    return {
      value: { accounts: res },
      key: 'getMyAccounts',
    };
  }

  @MessagePattern('updateLastMessageId')
  async updateLastMessageId(
    @Payload()
    value: {
      t_Id: number;
      lastMessageId: number;
    },
  ) {
    // const res = await this.userService.createNewCheck(
    //   value.userId,
    //   value.newChecks,
    // );
    // return {
    //   value: res,
    //   key: 'createNewCheck',
    // };
  }

  @MessagePattern('createNewCheck')
  async createNewCheck(
    @Payload()
    value: {
      newChecks: NewCheck[];
      userId: Types.ObjectId;
    },
  ) {
    const res = await this.userService.createNewCheck(
      value.userId,
      value.newChecks,
    );
    return {
      value: res,
      key: 'createNewCheck',
    };
  }

  @MessagePattern('createNewCategory')
  async createNewCategory(
    @Payload() value: { newAccounts: string[]; userId: Types.ObjectId },
  ) {
    const res = await this.userService.createNewCategory(
      value.userId,
      value.newAccounts,
    );
    return {
      value: res,
      key: 'createNewCategory',
    };
  }

  @MessagePattern('getUserIdByTelegramUser')
  async getUserIdByTelegramUser(@Payload() value: TelegramUser) {
    const res = await this.userService.getUserId(value);
    return {
      value: { user: res },
      key: 'getUserIdByTelegramUser',
    };
  }

  @MessagePattern('getSimpleUserByTelegramUser')
  async getUserByTelegramSimpleUser(@Payload() value: TelegramUser) {
    const res = await this.userService.getNewOrExistSimpleUser(value);
    return {
      value: { user: res },
      key: 'getSimpleUserByTelegramUser',
    };
  }

  @MessagePattern('getUserByTelegramUser')
  async getUserByTelegramUser(@Payload() value: TelegramUser) {
    const res = await this.userService.getNewOrExistUser(value);
    return {
      value: { user: res },
      key: 'getUserByTelegramUser',
    };
  }
}
