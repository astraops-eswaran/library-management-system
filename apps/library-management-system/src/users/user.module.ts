import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { DatabaseModule } from "../mongodb/database.module";
import { UserRepositary } from "./user.repositsry";
import { BorrowRepositary } from "../borrowing/borrowing.repositary";
import { AuthService } from "../auth/auth.service";
import { JwtService } from "@nestjs/jwt";



@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    AuthService,
    JwtService,
    Set,
    UserService,
    UserRepositary,
    BorrowRepositary
  ],
  exports:[UserService],
})
export class UserModule {}

