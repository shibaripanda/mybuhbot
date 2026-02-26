import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AccountDocument } from 'src/account/account.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  t_Id?: number;

  @Prop()
  t_name: string;

  @Prop()
  t_username: string;

  @Prop()
  language_code: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Account', autopopulate: true }],
    required: true,
    default: [],
  })
  accounts: AccountDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.index({ subscriptionExpiresAt: 1, status: 1 });
