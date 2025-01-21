import { Controller, Get } from "@nestjs/common";
import { MongodbService } from "./database.service";



@Controller('database')

export class DatabaseController{
    constructor(
        private readonly databaseService:MongodbService
    ){}

    @Get('status')
    async getstatus(){
        return this.databaseService.mongooseConnection.status;
    }

    @Get('connection')
    async getConnection(){
        return this.databaseService.mongooseConnection.connection;
    }

    @Get('disconnect')
    async disconnect(){
        return this.databaseService.disconnect();
    }

    @Get('connect')
    async connect(){
        return this.databaseService.connect();
    }
}