import { Injectable } from "@nestjs/common";
import { Book, CreateBookDto, UpdateBookDto } from "./schema/book.schema";
import { BookRepositary } from "./book.repositary";

@Injectable()
export class BookService {
   // constructor(@InjectModel('Book') private bookModel: Model<Book>) {}
    constructor(
        private readonly bookRepo:BookRepositary,
    ) {}

        async add(book: CreateBookDto): Promise<Book> {
        // Updated validation logic
        if(book.title === '' || book.author === '' || book.description === ''
            || book.price > 0 || !book.category || book.category.length === 0){
            throw new Error('All fields are required and must be valid.');
        }

        const existingBook = await this.bookRepo.findOne(book.title);

        if(existingBook){
            existingBook.count = (existingBook.count || 1) + 1;
            return existingBook; 
        }

        const createdBook =  await this.bookRepo.create({ ...book, count: 1 });
        return  createdBook;
    }
    async findAll(): Promise<Book[]> {
        return await this.bookRepo.findAll();
    }
    async findById(id: string): Promise<Book> {
        return await this.bookRepo.findById(id);
    }
    async update(id:string, book: UpdateBookDto): Promise<Book[]> {
        return await this.bookRepo.findByIdAndUpdate(id, book);
    }
    
    async delete(id: string): Promise<Book> {
        const book = await this.bookRepo.findById(id);

    if (!book) {
        throw new Error('Book not found.');
    }

    if (book.count > 1) {
        book.count -= 1;
        await this.bookRepo.update(id, { count: book.count });
    }
    return await this.bookRepo.delete(id)
    }
}       