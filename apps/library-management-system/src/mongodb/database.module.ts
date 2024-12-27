
import { Module } from '@nestjs/common';
//import { databaseProviders } from './database.providers';
import { MongodbService } from './database.service';
import { DatabaseController } from './database.controller';

@Module({
  controllers:[DatabaseController],
  providers: [MongodbService],
  exports: [MongodbService],
})
export class DatabaseModule {}
