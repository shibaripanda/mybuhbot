import { Injectable } from '@nestjs/common';
import { Account } from './interfaces/User';

@Injectable()
export class BotKeyboardService {
  constructor() {}

  keyboardEmpty() {
    return [[], []];
  }

  keyboardMyAccounts(myAccounts: Account[]) {
    const res = myAccounts.map((ac) => [
      {
        text:
          ac.name !== '_backet_'
            ? ac.name + ' 💵 ' + ac['sum'] + ` (${ac['count']})`
            : 'Корзина' + ' 💵 ' + ac['sum'] + ` (${ac['count']})`,
        callback_data: `myAcc_${ac._id}`,
      },
    ]);
    return res.concat(this.keyboardMenuBut());
  }

  keyboardMainMenu() {
    return [
      [{ text: `Мои аккаунты`, callback_data: 'myAccounts' }],
      [{ text: `Расходы за сегодня`, callback_data: 'money_1' }],
      [{ text: `Расходы за 7 дней`, callback_data: 'money_7' }],
      [{ text: `Расходы за 30 дней`, callback_data: 'money_30' }],
      [{ text: `Расходы за 180 дней`, callback_data: 'money_180' }],
      [{ text: `Расходы за 365 дней`, callback_data: 'money_365' }],
    ];
  }

  keyboardMenuBut() {
    return [[{ text: `Меню`, callback_data: 'mainMenu' }]];
  }

  keyboardStart() {
    return [[{ text: `Меню`, callback_data: 'mainMenu' }]];
  }
}
