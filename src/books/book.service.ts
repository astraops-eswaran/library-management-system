import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Book, CreateBookDto, UpdateBookDto } from "./schema/book.schema";


@Injectable()
export class BookService {
    constructor(@InjectModel('Book') private bookModel: Model<Book>) {}

    async add(book: CreateBookDto): Promise<Book> {
        if(book.title === '' && book.author === '' && book.description === ''
            && book.price === 0 && book.category.includes(book.category)) {
            throw new Error('All fields are required');
        }
        const createdBook = new this.bookModel(book);
        return  createdBook.save();
    }
    async findAll(): Promise<Book[]> {
        return this.bookModel.find().exec();
    }
    async findById(id: string): Promise<Book> {
        return this.bookModel.findById(id);
    }
    async update(id: string, book: UpdateBookDto): Promise<Book> {
        return this.bookModel.findByIdAndUpdate(id, book);
    }
    async delete(id: string): Promise<Book> {
        return this.bookModel.findByIdAndDelete(id);
    }
}       