import { Controller, Get, Post, Body, Param, Put, NotFoundException, Delete, UseGuards, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./schema/user.schema";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Role } from "../roles/role.enum";
import { Roles } from "../roles/roles.decorator";
import { RolesGuard } from "../roles/roles.guard";
import { AuthService } from "../auth/auth.service";
import { Public } from "../common/is-public.decorator";
import { RegisterDto } from "../common/dto/register.dto";


@Controller("users")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    
    @Post()
    @Public()
    async createUser(@Body() user: User) {
        return this.userService.create(user);
    }
    
    @Post('create-admin')
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createAdmin(@Body() registerDto: RegisterDto) {
        return this.authService.signUp(registerDto);
    }
    
    @Get('all')
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getUsers() {
        const users = await this.userService.findAll();
        if(!users) {
            throw new NotFoundException("No users found");
        }
        return users;
    }

    @Get(":id")
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async findById(@Param("id") id: string) {
        const user = await this.userService.findOne(id);
        if(!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    @Put(":id")
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async updateUser(@Param("id") id: string, @Body() user: User) {
        return this.userService.update(id, user);
    }

    @Delete(":id")
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteUser(@Param("id") id: string) {
        return this.userService.delete(id);
    }
}       