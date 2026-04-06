import { Injectable } from '@nestjs/common';
import { Check } from 'src/openai/openai.voice.service';

@Injectable()
export class BotTextService {
  constructor() {}

  textAfterVoice(res) {
    console.log(res);
    return 'ответ';
  }

  textMyAccounts() {
    return 'Мои аккаунты';
  }

  textMainMenu() {
    return 'Вот';
  }

  textStart() {
    return 'Hello';
  }

  textSuccsessNewAccount(checks: string[]) {
    return `✅ Акаунт(ы) созданы:\n${checks.join(', ')}`;
  }

  textSuccsessNewCheck(checks: Check[]) {
    return `✅ Чек(и) созданы:\n${checks.map((ch) => '▫️ ' + ch.account + '\n- ' + ch.info + ' 💵 ' + ch.cost + '\n').join(', ')}`;
  }

  textError() {
    return '❌ Ошибка, попробуйте еще раз\n/Start';
  }
}
