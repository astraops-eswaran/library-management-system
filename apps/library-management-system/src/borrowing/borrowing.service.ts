import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Borrowing, BorrowingDto } from "./schema/borrow.schema";
import { UserService } from "../users/user.service";
import { BookService } from "../books/book.service";
import { BorrowRepositary } from "./borrowing.repositary";

@Injectable()
export class BorrowingService {
    // constructor(
    //     //@Inject("BORROWING_MODEL") private borrowRepo: Model<Borrowing>,
    //     

    // ) {}
    constructor(
        private bookService:BookService,
        private userService:UserService,
        private readonly borrowRepo:BorrowRepositary
    ){}

    async findById(id:string):Promise<Borrowing>{
        return await this.borrowRepo.findById(id);
    }
    async findAll():Promise<Borrowing[]>{
        return await this.borrowRepo.findAll();
    }

    //borrow a book in the library by the user
    async barrowBook(borrowing: BorrowingDto): Promise<Borrowing> {
        if (!borrowing.bookId || !borrowing.userId) {
            const missingField = !borrowing.bookId ? "BookId" : "UserId";
            throw new BadRequestException(`${missingField} is required`);
        }
    
        const getUser = await this.userService.findById(borrowing.userId);
        if (!getUser) {
            throw new BadRequestException("User not found");
        }
    
        const getBook = await this.bookService.findById(borrowing.bookId) as Borrowing;
        if (!getBook) {
            throw new BadRequestException("Book not found in the library");
        }
    
        if (getBook.count <= 0) {
            throw new BadRequestException("Book is out of stock.");
        }
    
        // Check if the book is already borrowed by the user
        const existBook = await this.borrowRepo.findOne(
             borrowing.bookId,
             borrowing.userId,
        );
        
        if (existBook) {
            throw new BadRequestException("This book is already borrowed by the user.");
        }
    
        // Check if the user has borrowed more than 4 books
        const userBorrowings = await this.borrowRepo.findByUserId(borrowing.userId);
    
        if (userBorrowings.length >= 4) {
            throw new BadRequestException("You cannot borrow more than 4 books at a time.");
        }
    
        // Update book count and save
        getBook.count -= 1;
        await this.bookService.update(getBook.id, {count:getBook.count});

        // Create a new borrowing record
        const newBorrowing = await this.borrowRepo.create({
            ...borrowing,
            title: getBook.title, 
        });
        return newBorrowing;
    }
    

    //delete the borrowing record
    async delete(id:string):Promise<Borrowing>{
        const returnedBook = await this.borrowRepo.findByIdAndDelete(id);
        return returnedBook;
    }

    async findByUserIdAndBookId(userId:string, bookId:string):Promise<Borrowing>{
        let borrowing = await this.borrowRepo.findOne(userId,bookId)
        if (!borrowing) {
            throw new BadRequestException("Book returned not found");
        }
        if(userId && bookId){
            const res = await this.borrowRepo.findOneAndDelete(borrowing.id); 
            const dueDate =  new Date(borrowing.returnDate); 
            const currentDate = new Date()

            //collecting fine for over the due date of returning the book
            const finePerDay = 5;
            const diffInMilliseconds = currentDate.getTime() - dueDate.getTime();
            console.log(diffInMilliseconds)
            const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)); 

            if (diffInDays > 0) {
                const fine = diffInDays * finePerDay;
                console.log(`The payment is overdue by ${diffInDays} days. The fine is $${fine}.`);
              } else {
                console.log('No fine. The payment is within the due date.');
            }
            const book = await this.bookService.findById(bookId);
            book.count +=1; 
            await this.bookService.update(book.id,{count:book.count})
            return res;
        }
        throw new BadRequestException("User id and book id are required");
    }
}
