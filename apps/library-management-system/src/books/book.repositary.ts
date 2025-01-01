import { BadRequestException, Injectable } from "@nestjs/common";
import { MongodbService } from "../mongodb/database.service";
import { Book, CreateBookDto, UpdateBookDto } from "./schema/book.schema";
import { MongooseConnectionStatus } from "../common/connection.schema";
import { BookSchema } from "../common/book.schema";
import {  Model } from "mongoose";


@Injectable()

export class BookRepositary{
   constructor(
    protected readonly mongodbService:MongodbService
   ){}

   private async getModel(): Promise<Model<Book>>{
        const conn = this.mongodbService.mongooseConnection;
        if(conn.status === MongooseConnectionStatus.enum.connected){
            return conn.connection.connection.useDb("libraryassets").model<Book>("Book",BookSchema);
        }
        throw new BadRequestException('Database connection error: connection is null or not established');
    }
    async create(book: CreateBookDto):Promise<Book>{
        return(await this.getModel()).create(book);
    }
    async findAll():Promise<Book[]>{
        return (await this.getModel()).find();
    }
    async update(id:string, book: Partial<Book>):Promise<Book>{
        await (await this.getModel()).updateOne({ _id: id }, { count: book.count });
        return this.findById(id);
    }
    async findById(id:string): Promise<Book>{
        return (await this.getModel()).findById(id);
    }
    async findOne(title:string):Promise<Book>{
        return (await this.getModel()).findOne({title});
    }
    async findByIdAndUpdate(id:string, book:UpdateBookDto):Promise<Book[]>{
        return (await this.getModel()).findByIdAndUpdate(id,book,{new:true});
    }
    async delete(id:string):Promise<Book>{
        return (await this.getModel()).findByIdAndDelete(id);
    }
}