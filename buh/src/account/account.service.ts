import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from './account.schema';
import { Model, Types } from 'mongoose';
import { CheckDocument } from 'src/check/check.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async addNewCheck(account_Id: Types.ObjectId, newCheck: CheckDocument) {
    const res = await this.accountModel.updateOne(
      { _id: account_Id },
      {
        $addToSet: {
          checks: newCheck._id,
        },
      },
    );
    return res;
  }

  async createNewAccounts(newAccounts: string[]) {
    const res = await this.accountModel.insertMany(
      newAccounts.map((name) => ({ name })),
    );
    return res;
  }

  async createTargetAccount() {
    return await this.accountModel.create({ name: '_backet_' });
  }
}
