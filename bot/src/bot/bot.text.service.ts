import { Injectable } from '@nestjs/common';

@Injectable()
export class BotTextService {
  constructor() {}

  textStart() {
    return 'Hello';
  }
}
