import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../common/interfaces/jwt-payload.interface"

import * as bcrypt from 'bcrypt';
import { LoginDto } from "../common/dto/login.dto";
import { RegisterDto } from "../common/dto/register.dto";
import { User } from "../users/schema/user.schema";
import { UserService } from "../users/user.service";
import { Role } from "../roles/role.enum";


@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService:JwtService,
        private tokenBlocklist: Set<string> = new Set()
    ) {}


    async signUp(registerDto:RegisterDto,requestingUserRole?: Role):Promise<{message:string,user:User}>{
        
        const registereduser = await this.userService.findOne(registerDto.username);

        if(registereduser){
            throw new BadRequestException("User already exists");
        }

        const users = await this.userService.findAll();
        let role: Role = users.length === 0 ? Role.Admin : Role.User||Role.Student||Role.Staff;

        if (registerDto.role === Role.Admin) {
            if (users.length === 0) {
                role = Role.Admin;
            } else if (requestingUserRole !== Role.Admin) {
                throw new UnauthorizedException("Only an admin can register another admin user");
            }
        }
        
        //password hashing
        const hashedPassword = await bcrypt.hash(registerDto.password,10);
        registerDto.password = hashedPassword;

        registerDto.role = role;

        const user = await this.userService.create(registerDto);

        return {message:"User created successfully",user};
    }

    //login the user and generate the jwt token
    async login(loginDto:LoginDto):Promise<{access_token:string,message:string}>{
        const user = await this.userService.findOne(loginDto.username)
        //check if the user exists
        if (!user) {
            throw new UnauthorizedException('username not found');
        }
        
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        //create the payload for the jwt token
        const payload:JwtPayload = { 
            sub: user.id, 
            role:user.role,
            username:user.username
        }
        return {
            //sign the jwt token
            message:"Login successful",
            access_token: await this.jwtService.signAsync(payload)
        };   
    } 
    //logout the session
    async logout(token:string):Promise<{message:string}>{
        this.tokenBlocklist.add(token);
        return { message: 'Logout successful' };
    }

    isTokenBlocklisted(token: string): boolean {
        return this.tokenBlocklist.has(token);
    }
}
