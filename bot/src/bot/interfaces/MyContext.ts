import { Context, NarrowedContext } from 'telegraf';
import { SimpleUser } from './User';
import { Message, Update as UpdateTelegraf } from '@telegraf/types';

export interface MyContext extends Context {
  simpleUser: SimpleUser;
}

export type UserTelegrafContext = NarrowedContext<
  MyContext,
  UpdateTelegraf.MessageUpdate & { message: Message.VoiceMessage } & {
    message: Message.PhotoMessage;
  }
>;
