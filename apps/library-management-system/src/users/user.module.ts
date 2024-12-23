import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { UserSchema } from "../common/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { DatabaseModule } from "../mongodb/database.module";
import { userProviders } from "./user.provider";
import { databaseProviders } from "../mongodb/database.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService,
    ...userProviders,...databaseProviders
  ],
  exports:[UserService],
})
export class UserModule {}

