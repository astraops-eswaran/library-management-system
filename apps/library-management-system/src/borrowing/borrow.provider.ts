
import { Connection } from 'mongoose';
import { BorrowingSchema } from '../common/borrowing.schema'

export const borrowProviders = [
  {
    provide: 'BORROWING_MODEL',
    useFactory: (connection: Connection) => connection.model('BorrowingSchema', BorrowingSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
