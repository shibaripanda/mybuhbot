import { Injectable } from '@nestjs/common';
import { Account } from './interfaces/User';
// import { NewAccountControl } from 'src/kafka/kafka.service';

@Injectable()
export class BotKeyboardService {
  constructor() {}

  // keyboardCreateAccounts(accounts: NewAccountControl[]) {
  //   const res = accounts.map((ac) => [
  //     {
  //       text: '❌ ' + ac.name,
  //       callback_data: `delId_${ac._id}`,
  //       style: 'danger',
  //     },
  //   ]);
  //   return res.concat(this.keyboardMenuButOk());
  // }

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
        callback_data: `myAcc:${ac._id}`,
      },
    ]);
    return res.concat(this.keyboardMenuBut());
  }

  keyboardMainMenu() {
    const buttons = [
      { t: 'Мои аккаунты', c: 'myAccounts', s: 'success' },
      // { t: 'Расходы за сегодня', c: 'myAccounts', s: 'primary' },
      // { t: 'Расходы за 7 дней', c: 'myMoney_7', s: 'primary' },
      // { t: 'Расходы за 30 дней', c: 'myMoney_30', s: 'primary' },
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

  keyboardMenuButOk() {
    return [
      [
        {
          text: `Хорошо`,
          callback_data: 'mainMenu',
          style: 'success',
        },
      ],
    ];
  }

  keyboardMenuBut() {
    return [
      [
        {
          text: `Меню`,
          callback_data: 'mainMenu',
          style: 'success',
        },
      ],
    ];
  }

  keyboardStart() {
    return [[{ text: `Меню`, callback_data: 'mainMenu' }]];
  }
}
