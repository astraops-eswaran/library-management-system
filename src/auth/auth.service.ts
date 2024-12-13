import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/users/user.service";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../common/interfaces/jwt-payload.interface"
import { User } from "src/users/schema/user.schema";
import { RegisterDto } from "src/common/dto/register.dto";
import { LoginDto } from "src/common/dto/login.dto";



@Injectable()
export class AuthService {
    constructor(private userService: UserService,private jwtService:JwtService) {}


    async signUp(registerDto:RegisterDto):Promise<{message:string,user:User}>{
        
        const registereduser = await this.userService.findOne(registerDto.username)
        if(registereduser){
            throw new BadRequestException("User already exists");
        }
        const user = await this.userService.create(registerDto);
        return {message:"User created successfully",user};
    }

    //login the user and generate the jwt token
    async login(loginDto:LoginDto):Promise<{access_token:string,message:string}>{
        const user = await this.userService.findOne(loginDto.username)
        console.log(user)
        //check if the user exists
        if (!user) {
            throw new UnauthorizedException('username not found');
        }
        //check if the password is correct
        if (user.password !== loginDto.password) {
            throw new UnauthorizedException('Invalid credentials');
        }
        //create the payload for the jwt token
        const payload:JwtPayload = { sub: user.id, role:user.role,username:user.username}
        return {
            //sign the jwt token
            message:"Login successful",
          access_token: await this.jwtService.signAsync(payload)
        };   
    } 
}
