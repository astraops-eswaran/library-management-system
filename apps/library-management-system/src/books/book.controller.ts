import { Controller, Post, Body, Get, Put, Param, Delete, UseGuards} from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto, UpdateBookDto, Book } from "./schema/book.schema";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Role } from "../roles/role.enum";
import { Roles } from "../roles/roles.decorator";
import { RolesGuard } from "../roles/roles.guard";



@Controller("books")
export class BookController {
    constructor(private readonly bookService: BookService) {}

    
    @Post()
    @Roles(Role.Admin)
    @UseGuards(RolesGuard,JwtAuthGuard)
    async addBook(@Body() book: CreateBookDto): Promise<{message: string, book: Book}> {
        return {message:"Book added successfully in the library", book: await this.bookService.add(book)};
    }

    @Get()
    async getBooks(): Promise<Book[]> {
        const books = await this.bookService.findAll();
        return books;
    }

    @Get(":id")
    @Roles(Role.Admin,Role.User)
    @UseGuards(RolesGuard,JwtAuthGuard)
    async getBookById(@Param("id") id: string): Promise<Book> {
        return this.bookService.findById(id);
    }

    @Put(":id")
    @Roles(Role.Admin)
    @UseGuards(RolesGuard,JwtAuthGuard)
    async updateBook(@Param("id") id: string, @Body() book: UpdateBookDto): Promise<{message: string, book: Book}> {
        return {message:"Book updated successfully", book: await this.bookService.update(id, book)}   ;
    }

    @Delete(":id")
    @Roles(Role.Admin)
    @UseGuards(RolesGuard,JwtAuthGuard)
    async deleteBook(@Param("id") id: string): Promise<{message: string, book: Book}> {
        return {message:"Book deleted successfully", book: await this.bookService.delete(id)};
    } 
}  