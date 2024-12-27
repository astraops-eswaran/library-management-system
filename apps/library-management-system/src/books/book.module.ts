import { MongooseModule } from "@nestjs/mongoose";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";   
import { Module } from "@nestjs/common";
import { BookSchema } from "../common/book.schema";
import { DatabaseModule } from "../mongodb/database.module";
import { BookRepositary } from "./book.repositary";




@Module({
    //imports: [],
    imports: [DatabaseModule],
    controllers: [BookController],
    //providers: [BookService],
    providers: [
        BookService,
        BookRepositary
    ],
    exports: [BookService]
})
export class BookModule {}  