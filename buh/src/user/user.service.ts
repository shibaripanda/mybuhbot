import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { TelegramUser } from './interfaces/TelegramUser';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private accountService: AccountService,
  ) {}

  async getNewOrExistUser(user: TelegramUser): Promise<UserDocument | null> {
    if (!user) return null;

    const ex = await this.userModel
      .findOne({ t_Id: user.id })
      .populate({
        path: 'accounts',
        populate: { path: 'checks' },
      })
      .lean()
      .exec();
    if (ex) {
      // ex.t_username = user.username ?? '';
      // ex.language_code = user.language_code ?? '';
      // await ex.save();
      return ex;
    }
    const zeroAccount = await this.accountService.createTargetAccount();
    const created = new this.userModel({
      t_Id: user.id,
      t_username: user.username ?? '',
      name: user.first_name + (user.last_name ? ' ' + user.last_name : ''),
      language_code: user.language_code,
      accounts: [zeroAccount],
    });
    return created.save();
  }
}
