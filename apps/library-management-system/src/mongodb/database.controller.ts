import { Controller, Get } from "@nestjs/common";
import { MongodbService } from "./database.service";



@Controller('database')

export class DatabaseController{
    constructor(
        private readonly databaseService:MongodbService
    ){}

    @Get()
    async getstatus(){
        return this.databaseService.mongooseConnection.status;
    }
}
