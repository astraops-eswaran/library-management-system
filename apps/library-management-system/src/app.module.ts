import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './books/book.module';
import { BorrowingModule } from './borrowing/borrowing.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { AuthGuard } from './auth/auth.guard';
import { DatabaseModule } from './mongodb/database.module';
import { StatsModule } from './stats/stats.module';
import { EventEmitterModule } from '@nestjs/event-emitter';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    UserModule,
    BookModule,
    BorrowingModule,
    AuthModule,
    DatabaseModule,
    MongooseModule,
    StatsModule,
    EventEmitterModule.forRoot(),
  ],
  providers:[
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard, 
    },
  ],
})
export class AppModule {}
