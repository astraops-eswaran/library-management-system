import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Borrowing, BorrowingDto } from "./schema/borrow.schema";
import { BookService } from "src/books/book.service";
import { UserService } from "src/users/user.service";

@Injectable()
export class BorrowingService {
    constructor(@InjectModel("Borrowing") private borrowingModel: Model<Borrowing>,
    private bookService:BookService,
    private userService:UserService) {}

    async findById(id:string):Promise<Borrowing>{
        return this.borrowingModel.findById(id);
    }
    async findAll():Promise<Borrowing[]>{
        return this.borrowingModel.find();
    }

    //borrow a book in the library by the user
    async barrowBook(borrowing:BorrowingDto):Promise<Borrowing>{
        if (!borrowing.bookId || !borrowing.userId) {
            const missingField = !borrowing.bookId ? "BookId" : "UserId";
            throw new BadRequestException(`${missingField} is required`);
        }
        const getUser = await this.userService.getUser(borrowing.userId);
        if(!getUser){
            throw new BadRequestException("User not found");
        }
        const getBook = await this.bookService.findById(borrowing.bookId);
        if(!getBook){
            throw new BadRequestException("Book not found in the library");
        }

        //check if the book is already borrowed by the user
        const existBook = await this.borrowingModel.findOne({
            bookId: borrowing.bookId,
            userId: borrowing.userId
        });
        if (existBook) {
            throw new BadRequestException("This book is already borrowed by the user.");
        }
        
        const userBorrowings = await this.borrowingModel.find({
            userId: borrowing.userId
        });
        if (userBorrowings.length >=4) {
            throw new BadRequestException("You cannot borrow more than 4 books at a time.");
        }        
        const newBorrowing = await this.borrowingModel.create(borrowing);
        const bookName = newBorrowing.title
        console.log(bookName);
        return newBorrowing;
    }

    //delete the borrowing record
    async delete(id:string):Promise<Borrowing>{
        const returnedBook = await this.borrowingModel.findByIdAndDelete(id);
        return returnedBook;
    }

    async findByUserIdAndBookId(userId:string, bookId:string):Promise<Borrowing>{
        let borrowing = await this.borrowingModel.findOne({userId,bookId});
        if (!borrowing) {
            throw new BadRequestException("Book returned not found");
        }
        console.log(borrowing);
        if(userId && bookId){
            const res = await this.borrowingModel.findOneAndDelete({_id:borrowing._id});
            return res;
        }
        throw new BadRequestException("User id and book id are required");
    }
}
