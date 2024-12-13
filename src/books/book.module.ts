import { MongooseModule } from "@nestjs/mongoose";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";   
import { Module } from "@nestjs/common";
import { BookSchema } from "../common/book.schema";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }])],
    controllers: [BookController],
    providers: [BookService],
    exports:[BookService]
})
export class BookModule {}  