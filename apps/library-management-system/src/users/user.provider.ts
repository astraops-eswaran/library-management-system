
import { Connection } from 'mongoose';
import { UserSchema } from '../common/user.schema';

export const userProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) => connection.model('UserSchema', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
