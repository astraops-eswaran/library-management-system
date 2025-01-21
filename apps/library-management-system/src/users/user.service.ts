import { UpdateUserDto, User } from "./schema/user.schema";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./schema/user.schema";
import { UserRepositary } from "./user.repositsry";
import { BorrowRepositary } from "../borrowing/borrowing.repositary";
import { EventEmitter2 } from "@nestjs/event-emitter";


@Injectable()
export class UserService {
    getById(userId: string): { userId?: string; totalBorrowedBooks?: number; } | PromiseLike<{ userId?: string; totalBorrowedBooks?: number; }> {
        throw new Error("Method not implemented.");
    }
    constructor(
        private readonly userRepo: UserRepositary,
        private readonly borrowRepo:BorrowRepositary,
        private readonly eventEmitter: EventEmitter2,
    ) {
        if (!userRepo) {
            throw new Error('UserRepositary is not initialized');
        }
        console.log('UserRepositary initialized:', userRepo);
    }

    //create a new user
    async create(user: CreateUserDto): Promise<User> {
        try {
            const createdUser = await this.userRepo.create(user);
            //emit the event to the stats service
            this.eventEmitter.emit('user-created',createdUser);
            return createdUser;  
        } catch (error) {
            throw new Error('Error creating user: ' + (error.message || 'Unknown error'));
        }

    }
    async findAll(): Promise<User[]> {
        return (await this.userRepo.findAll());
    }
    async findById(id:string): Promise<User> {
        if(!id) {
            throw new NotFoundException('User not found');
        }
        return (await this.userRepo.findById(id));
    }
    async findOne(username: string): Promise<User> {
        
        return (await this.userRepo.findOne(username));
    }
    async update(id: string, user: UpdateUserDto): Promise<User[]> {
        return await this.userRepo.findByIdAndUpdate(id,user);
    }
    async delete(id: string): Promise<{message: string, user: User}> {
        const deletedUser = await this.userRepo.findByIdAndDelete(id);
        if(!deletedUser) {
            throw new NotFoundException('User not found');
        }
        const isBooksReturned = await this.borrowRepo.findByUserId(id)
        if(isBooksReturned.length > 0){
            throw new Error('User cannot be deleted because they have not returned the books');
        }
        return {message: 'User removed successfully', user:deletedUser};
    }
}  