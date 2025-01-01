import { BadRequestException, Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { Borrowing, BorrowingDto } from "./schema/borrow.schema";
import { BorrowingSchema } from "../common/borrowing.schema"
import { MongodbService } from "../mongodb/database.service";
import { MongooseConnectionStatus } from "../common/connection.schema";
import { Book } from "../books/schema/book.schema";


@Injectable()
export class BorrowRepositary{
    
    constructor(
        protected readonly mongodbService:MongodbService
    ){}

    async getModel(): Promise<Model<Borrowing>>{
        const conn = this.mongodbService.mongooseConnection;
        if(conn.status === MongooseConnectionStatus.enum.connected){
            return conn.connection.connection.useDb("libraryassets").model<Borrowing>("Borrowing",BorrowingSchema);
        }
        throw new BadRequestException('Database connection error: connection is null or not established');
    }
    async create(borrowingData: BorrowingDto): Promise<Borrowing> {
        const BorrowingModel = await this.getModel();
        const newBorrowing = new BorrowingModel(borrowingData);
        return await newBorrowing.save();
    }
    async findAll():Promise<Borrowing[]>{
        return (await this.getModel()).find()
    }
    
    async findById(id:string): Promise<Borrowing>{
        return (await this.getModel()).findById(id);
    } 

    async getDueSoonBooks(query: any): Promise<Book[]> {
        const model = await this.getModel();
        return model.find({ title: query.title, returnDate: { $lte: query.returnDate } });
    }

    async delete(id:string):Promise<Borrowing>{
        return (await this.getModel()).findByIdAndDelete(id);
    }
    async findByUserIdAndBookId(userId:string, bookId:string):Promise<Borrowing>{
        return ((await this.getModel()).findOne({userId,bookId}))
    }
    async findByUserId(userId: string): Promise<Borrowing[]> {
        return (await this.getModel()).find({ userId }).exec(); 
    }
    async findOne(userId:string, bookId:string){
        return ((await this.getModel()).findOne({bookId,userId}));
    }
    async findByIdAndDelete(id: string): Promise<Borrowing | null> {
        return (await this.getModel()).findByIdAndDelete(id).exec();
    }
    async findOneAndDelete(id:string): Promise<Borrowing | null> {
        return (await this.getModel()).findOneAndDelete({_id:id})
    }
}