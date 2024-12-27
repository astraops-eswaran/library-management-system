import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { 
    MongooseConnectionStatus, 
    MongooseConnectionStatusType, 
    MongooseConnectionType 
} from "../common/connection.schema";
import mongoose from "mongoose";


@Injectable()

export class MongodbService implements OnModuleInit {
    mongooseConnection:MongooseConnectionType;
    private logger = new Logger(MongodbService.name);

   constructor(){
    this.mongooseConnection = {
        status:MongooseConnectionStatus.enum.disconnected,
        connection: null,
       }
   }

    async onModuleInit() {
       await this.connect()
   }

   private setUpListners(db:mongoose.Connection){
    db.on('connected',()=>{
        try{
            this.logger.log('MongoDB Connected');
        }catch(err){
            this.logger.log(`Failed to delete interval retry-mongodb-connection:${err}`)
        }
    });
   }

   async connect():Promise<MongooseConnectionType>{
    const dbUrl = process.env.DB_URI
    this.logger.log(`Connecting to....`);
    try{
        if(this.mongooseConnection.status === MongooseConnectionStatus.enum.connected){
            this.logger.log(`Already connected to...`);
            return this.mongooseConnection;
        }
        else{
            this.mongooseConnection = {
                status:MongooseConnectionStatus.enum.connected,
                connection: await mongoose.connect(dbUrl),
            }
        }
        this.logger.log(`Connected to the DB`);
        this.setUpListners(this.mongooseConnection.connection.connection)
    }catch(err){
        this.logger.error(`Failed to connect to database: ${err}`)
        this.mongooseConnection = {
            status:MongooseConnectionStatus.enum.disconnected,
            connection: null,
        }
    }
    return this.mongooseConnection;
   }

   async disconnect():Promise<MongooseConnectionStatusType>{

    this.logger.log('DB is disconnecting...');

    if(this.mongooseConnection.status === MongooseConnectionStatus.enum.connected){
        await this.mongooseConnection.connection.disconnect()
    }
    this.mongooseConnection = {
        status:MongooseConnectionStatus.enum.disconnected,
        connection: null,
    };
    this.logger.log('Database disconnected successfully');
    return this.mongooseConnection.status;
   }

   getStatus(): string {
    return this.mongooseConnection.status;
  }

}