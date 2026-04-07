import { Types } from 'mongoose';

export interface TelegramUser {
  id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  language_code: string;
}

export interface GetAccountWithChecks {
  id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  language_code: string;
  account_id: Types.ObjectId;
}
