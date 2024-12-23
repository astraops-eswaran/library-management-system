import { MongooseModule } from "@nestjs/mongoose";
import { BorrowingService } from "./borrowing.service";
import { BorrowingSchema } from "../common/borrowing.schema";
import { Module } from "@nestjs/common";
import { BorrowingController } from "./borrowing.cotroller";
import { UserModule } from "../users/user.module";
import { BookModule } from "../books/book.module";
import { DatabaseModule } from "../mongodb/database.module";
import { borrowProviders } from "./borrow.provider";


@Module({
    imports: [
    DatabaseModule,
    BookModule,
    UserModule
],
    controllers: [BorrowingController],
    providers: [
        BorrowingService,
        ...borrowProviders
    ],
})
export class BorrowingModule {}