import { Controller, Post, Body, Get, Param} from "@nestjs/common";
import { BorrowingService } from "./borrowing.service";
import { Borrowing, BorrowingDto } from "./schema/borrow.schema";
import { BookService } from "src/books/book.service";
import { Role } from "src/roles/role.enum";
import { Roles } from "src/roles/roles.decorator";


@Controller("borrowing")
export class BorrowingController {

    constructor(private readonly borrowingService: BorrowingService) {}
    
    @Get()
    @Roles(Role.Admin)
    async getBorrowings():Promise<{message:string, borrowings:Borrowing[], count:any}>{
        const count = await this.borrowingService.findAll();
        return {
            message:"Borrowings fetched successfully", 
            borrowings:count, count:count.length
        };
    }
    @Get(':id')
    async getBorrowingById(@Param('id') id: string): Promise<{ message: string; borrowings: Borrowing[], count: number }> {
        const borrowings = await this.borrowingService.findAll();
        const userBorrowings = borrowings.filter(borrowing => borrowing.userId === id);
    
        return {
            message: "Borrowings fetched successfully",
            borrowings: userBorrowings,
            count: userBorrowings.length
        };
    }
    
    @Post('borrow')
    async barrowBook(@Body() borrowing: BorrowingDto): Promise<{message: string, book: Borrowing}> {
        return {
            message: "Book borrowed successfully",
            book:await this.borrowingService.barrowBook(borrowing)
        };
    }

    @Post("bookreturn")
    async returnBook(@Body("userId") userId:string, @Body("bookId") bookId:string):Promise<{message:string, book:Borrowing}>{  
        return {message:"Book returned successfully",
            book:await this.borrowingService.findByUserIdAndBookId(userId,bookId),
        }; 
    }
}
