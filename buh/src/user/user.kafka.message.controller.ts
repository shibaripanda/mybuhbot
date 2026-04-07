import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  GetAccountWithChecks,
  TelegramUser,
} from './interfaces/KafkaInterfaces';
import { Types } from 'mongoose';

export interface NewCheck {
  account: string;
  info: string;
  cost: number;
  account_id: Types.ObjectId;
}

@Controller()
export class UserKafkaMessageController {
  constructor(private userService: UserService) {}

  @MessagePattern('getAccountWithChecks')
  async getAccountWithChecks(@Payload() value: GetAccountWithChecks) {
    const res = await this.userService.getAccountWithChecks(value);
    return {
      value: { accountWithChecks: res },
      key: 'getAccountWithChecks',
    };
  }

  @MessagePattern('getUserSimpleAccounts')
  async getUserSimpleAccounts(@Payload() value: TelegramUser) {
    const res = await this.userService.getUserSimpleAccounts(value);
    return {
      value: { user: res },
      key: 'getMyAccounts',
    };
  }

  @MessagePattern('getMyAccounts')
  async getMyAccounts(@Payload() value: TelegramUser) {
    const res = await this.userService.getMyAccounts(value);
    return {
      value: { accounts: res },
      key: 'getMyAccounts',
    };
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
