import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UpdateUserDto, User } from "./schema/user.schema";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./schema/user.schema";

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<User>) {}

    //create a new user
    async create(user: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(user);
        console.log(createdUser)
        return createdUser.save();  
    }
    async findAll(): Promise<User[]> {
        return this.userModel.find();
    }
    async getUser(id: string): Promise<User> {
        if(!id) {
            throw new NotFoundException('User not found');
        }
        return this.userModel.findById(id);
    }
    async findOne(username: string): Promise<User> {
        return this.userModel.findOne({username:username});
    }
    async update(id: string, user: UpdateUserDto): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, user, { new: true });
    }
    async delete(id: string): Promise<{message: string, user: User}> {
        const deletedUser = await this.userModel.findByIdAndDelete(id);
        if(!deletedUser) {
            throw new NotFoundException('User not found');
        }
        return {message: 'User removed successfully', user: deletedUser};
    }
}  