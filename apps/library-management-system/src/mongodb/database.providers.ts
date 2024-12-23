import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (configService: ConfigService): Promise<typeof mongoose> => {
      return mongoose.connect(configService.get('DB_URI'))
    },
    inject: [ConfigService],
  },
];
