import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Module } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "../users/user.module";
import { JwtAuthGuard } from "./jwt-auth.guard";


@Module({
    imports:[
        ConfigModule.forRoot({isGlobal: true}),
        JwtModule.register({
            global: true,
            secret:process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
        }),
        PassportModule,
        UserModule,
    ],
    controllers:[AuthController],
    providers:[AuthService,JwtStrategy,JwtAuthGuard,Set],
    exports:[AuthService], 
})
export class AuthModule {}