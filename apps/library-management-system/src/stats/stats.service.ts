import { Injectable } from "@nestjs/common";
import { StatsRepository } from "./stats.repositary";
import { StatsUser } from "./schema/stats-user.schema";
import { OnEvent } from "@nestjs/event-emitter";
import { User } from "../users/schema/user.schema";

@Injectable()
export class StatsService {
    constructor(
        private readonly statsRepository: StatsRepository,
    ) {}

    @OnEvent('user-created')
    handleUserCreated(user: User){
        console.log('User created',user);
    }
}
