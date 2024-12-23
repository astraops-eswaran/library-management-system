import { InjectModel } from "@nestjs/mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Book, CreateBookDto, UpdateBookDto } from "./schema/book.schema";

@Injectable()
export class BookService {
   // constructor(@InjectModel('Book') private bookModel: Model<Book>) {}
    constructor(@Inject('BOOK_MODEL') private bookModel: Model<Book>) {}


    async add(book: CreateBookDto): Promise<Book> {
        if(book.title === '' && book.author === '' && book.description === ''
            && book.price !== 0 && book.category.includes(book.category)){
            throw new Error('All fields are required and must be valid.');
        }

        const existingBook = await this.bookModel.findOne({
            title: book.title,
            author: book.author,
            category: { $all: book.category },
        });

        if(existingBook){
            existingBook.count = (existingBook.count || 1) + 1;
            return existingBook.save(); 
        }

        const createdBook = new this.bookModel({ ...book, count: 1 });
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
        const book = await this.bookModel.findById(id);

    if (!book) {
        throw new Error('Book not found.');
    }

    if (book.count > 1) {
        book.count -= 1;
        await book.save();
    }
        return this.bookModel.findByIdAndDelete(id);
    }
}       