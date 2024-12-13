import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/users/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Module } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule } from "@nestjs/config";


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
    providers:[AuthService,JwtStrategy],
    exports:[AuthService], 
})
export class AuthModule {}