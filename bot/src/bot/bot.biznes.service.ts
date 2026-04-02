import { Injectable } from '@nestjs/common';
import { KafkaService } from 'src/kafka/kafka.service';
import { BotKeyboardService } from './bot.keyboard.service';
import { BotTextService } from './bot.text.service';
import {
  CreateNewCategory,
  CreateNewCheck,
  Expense,
} from 'src/openai/openai.voice.service';
import { Account, ServerUser } from './interfaces/User';

@Injectable()
export class BotBiznesService {
  constructor(
    private readonly kafkaService: KafkaService,
    private botKeyboardService: BotKeyboardService,
    private botTextService: BotTextService,
  ) {}

  myAccounts(myAccounts: Account[]) {
    console.log(myAccounts);
    return {
      text: this.botTextService.textMyAccounts(),
      keyboard: this.botKeyboardService.keyboardMyAccounts(myAccounts),
    };
  }

  async biznesStep(openAIresponce: Expense, user: ServerUser) {
    if (openAIresponce.step === 1) {
      return await this.createNewCategory(
        openAIresponce.data as CreateNewCategory,
        user,
      );
    }

    if (openAIresponce.step === 2) {
      return await this.createnewCheck(
        openAIresponce.data as CreateNewCheck,
        user,
      );
    }

    return {
      text: 'Error\n/start',
      keyboard: this.botKeyboardService.keyboardEmpty(),
    };
  }

  private async createnewCheck(data: CreateNewCheck, user: ServerUser) {
    console.log(data, user);
    const stringToIds = data.newChecks.map((ch) => ({
      ...ch,
      account_id: user.accounts.find((item) => item.name === ch.account)?._id,
    }));
    const res = await this.kafkaService.kafkaRequest('createNewCheck', {
      newChecks: stringToIds,
      userId: user._id,
    });
    console.log('createNewCheck', res);
    if (!res.status) {
      return {
        text: this.botTextService.textError(),
        keyboard: this.botKeyboardService.keyboardMenuBut(),
      };
    }
    return {
      text: this.botTextService.textSuccsessNewCheck(data.newChecks),
      keyboard: this.botKeyboardService.keyboardMenuBut(),
    };
  }

  private async createNewCategory(data: CreateNewCategory, user: ServerUser) {
    console.log(data, user);
    const res = await this.kafkaService.kafkaRequest('createNewCategory', {
      ...data,
      userId: user._id,
    });
    if (!res.status) {
      return {
        text: this.botTextService.textError(),
        keyboard: this.botKeyboardService.keyboardMenuBut(),
      };
    }
    return {
      text: this.botTextService.textSuccsessNewAccount(data.newAccounts),
      keyboard: this.botKeyboardService.keyboardMenuBut(),
    };
  }
}
