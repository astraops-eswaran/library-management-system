import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsRepository } from './stats.repositary';
import { UserModule } from '../users/user.module';
import { DatabaseModule } from '../mongodb/database.module';


@Module({
    imports: [
        UserModule,
        DatabaseModule
    ],
    providers: [
        StatsService,
        StatsRepository,
    ],
    exports: [StatsService],
})
export class StatsModule {}