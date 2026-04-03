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
    const buttons = [
      { t: 'Мои аккаунты', c: 'myAccounts', s: 'success' },
      { t: 'Расходы за сегодня', c: 'myAccounts', s: 'primary' },
      { t: 'Расходы за 7 дней', c: 'myMoney_7', s: 'primary' },
      { t: 'Расходы за 30 дней', c: 'myMoney_30', s: 'primary' },
    ];
    return buttons.map((b) => [{ text: b.t, callback_data: b.c, style: b.s }]);
    // return [
    //   [
    //     {
    //       text: `Мои аккаунты`,
    //       callback_data: 'myAccounts',
    //       style: 'success',
    //     },
    //   ],
    //   [
    //     {
    //       text: `Расходы за сегодня`,
    //       callback_data: 'money_1',
    //       style: 'danger',
    //     },
    //   ],
    //   [
    //     {
    //       text: `Расходы за 7 дней`,
    //       callback_data: 'money_7',
    //       style: 'primary',
    //     },
    //   ],
    //   [
    //     {
    //       text: `Расходы за 30 дней`,
    //       callback_data: 'money_30',
    //     },
    //   ],
    //   [{ text: `Расходы за 180 дней`, callback_data: 'money_180' }],
    //   [{ text: `Расходы за 365 дней`, callback_data: 'money_365' }],
    // ];
  }

  keyboardMenuBut() {
    return [
      [
        {
          text: `Меню`,
          callback_data: 'mainMenu',
          style: 'success',
          icon_custom_emoji_id: '123456789',
        },
      ],
    ];
  }

  keyboardStart() {
    return [[{ text: `Меню`, callback_data: 'mainMenu' }]];
  }
}
