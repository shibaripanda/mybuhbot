import { Injectable } from '@nestjs/common';

@Injectable()
export class BotKeyboardService {
  constructor() {}

  keyboardStart() {
    return [
      [
        {
          text: 'Подарки от Крюгера',
          callback_data: 'takePlacePresent',
        },
      ],
      [{ text: `В начало`, callback_data: 'mainMenu' }],
    ];
  }
}
