import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto, User } from "./schema/user.schema";
import { Model, Types } from "mongoose";
import { MongodbService } from "../mongodb/database.service";
import { MongooseConnectionStatus } from "../common/connection.schema";
import { UserSchema } from "../common/user.schema";




@Injectable()

export class UserRepositary{
    

    constructor(protected readonly mongodbService:MongodbService) {
    }

    private async getModel(): Promise<Model<User>>{
        const conn = this.mongodbService.mongooseConnection;
        if(conn.status === MongooseConnectionStatus.enum.connected){
            return conn.connection.connection.model<User>("User",UserSchema);
        }
        throw new BadRequestException('error connection db')
    }

    async create(user: CreateUserDto):Promise<User>{
        return(await this.getModel()).create(user);
    }
    async findAll():Promise<User[]>{
        return (await this.getModel()).find()
    }
    async findById(id:string): Promise<User>{
        return (await this.getModel()).findById(id);
    }
    async findOne(username:string):Promise<User>{
        return (await this.getModel()).findOne({username:username});
    }
    async findByIdAndUpdate(id:string,user:UpdateUserDto):Promise<User[]>{
        return (await this.getModel()).findByIdAndUpdate(id,user,{new:true});
    }
    async findByIdAndDelete(id:string):Promise<User>{
        return (await this.getModel()).findByIdAndDelete(id);
    }
}