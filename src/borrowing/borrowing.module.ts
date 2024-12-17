import { MongooseModule } from "@nestjs/mongoose";
import { BorrowingService } from "./borrowing.service";
import { BorrowingSchema } from "../common/borrowing.schema";
import { Module } from "@nestjs/common";
import { BorrowingController } from "./borrowing.cotroller";
import { BookModule } from "src/books/book.module";
import { UserModule } from "src/users/user.module";

@Module({
    imports: [MongooseModule.forFeature([
    { name: "Borrowing", schema: BorrowingSchema }]),
    BookModule,
    UserModule
],
    controllers: [BorrowingController],
    providers: [BorrowingService],
})
export class BorrowingModule {}