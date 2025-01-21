import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "../users/user.service";
import { MongodbService } from "../mongodb/database.service";
import { Model } from "mongoose";
import { MongooseConnectionStatus } from "../common/connection.schema";
import { StatsUserSchema } from "../common/stats/stats-user.schema";
import { StatsUser } from "./schema/stats-user.schema";


@Injectable()
export class StatsRepository {
    constructor(
        private readonly mongodbService: MongodbService,
        private readonly userService: UserService,
    ) {}

    private async getModel(): Promise<Model<StatsUser>>{
        const conn = this.mongodbService.mongooseConnection;
        if(conn.status === MongooseConnectionStatus.enum.connected){
            return conn.connection.connection.useDb("libraryassets").model<StatsUser>("StatsUser",StatsUserSchema);
        }
        throw new BadRequestException('Database connection error: connection is null or not established');
    }

    async getStatsUser(userId: string): Promise<StatsUser> {
        const user = await this.userService.getById(userId);
        return (await this.getModel()).create(user);
    }
}
