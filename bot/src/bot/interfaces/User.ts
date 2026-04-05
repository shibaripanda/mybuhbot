export interface ServerUser {
  _id: string;
  t_Id?: number;
  t_name: string;
  t_username: string;
  language_code: string;
  lastMessageId: number;
  accounts: Account[];
}

export interface SimpleUser {
  _id: string;
  lastMessageId: number;
}

export interface Account {
  _id: string;
  name: string;
  count: number;
  checks: Check[];
}

export interface Check {
  _id: string;
  info: string;
  cost: number;
}
