
import { Connection } from 'mongoose';
import { BookSchema } from "../common/book.schema";

export const bookProviders = [
  {
    provide: 'BOOK_MODEL',
    useFactory: (connection: Connection) => connection.model('BookSchema', BookSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
