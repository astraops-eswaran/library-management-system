import { Controller, Post, Body, Get, Param, UseGuards} from "@nestjs/common";
import { BorrowingService } from "./borrowing.service";
import { Borrowing, BorrowingDto } from "./schema/borrow.schema";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Role } from "../roles/role.enum";
import { Roles } from "../roles/roles.decorator";
import { RolesGuard } from "../roles/roles.guard";



@Controller("borrowing")
export class BorrowingController {

    constructor(private readonly borrowingService: BorrowingService) {}
    
    @Get()
    @Roles(Role.Admin)
    @UseGuards(RolesGuard,JwtAuthGuard)
    async getBorrowings():Promise<{message:string, borrowings:Borrowing[], count:any}>{
        const count = await this.borrowingService.findAll();
        return {
            message:"Borrowings fetched successfully", 
            borrowings:count, count:count.length
        };
    }
    @Get(':id')
    @Roles(Role.Admin)
    @UseGuards(RolesGuard,JwtAuthGuard)
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
    @Roles(Role.Admin,Role.User)
    @UseGuards(RolesGuard,JwtAuthGuard)
    async barrowBook(@Body() borrowing: BorrowingDto): Promise<{message: string, book: Borrowing}> {
        return {
            message: "Book borrowed successfully",
            book:await this.borrowingService.barrowBook(borrowing)
        };
    }

    @Post("bookreturn")
    async returnBook(@Body("userId") userId:string, 
    @Body("bookId") bookId:string):Promise<{message:string, book:Borrowing}>{  
        return {message:"Book returned successfully",
            book:await this.borrowingService.findByUserIdAndBookId(userId,bookId),
        }; 
    }
}
