import { Controller, Get, Post, Body, Param, Put, NotFoundException, Delete, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./schema/user.schema";
import { Roles } from "src/roles/roles.decorator";
import { Role } from "src/roles/role.enum";
import { RolesGuard } from "src/roles/roles.guard";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    
    @Post()
    async createUser(@Body() user: User) {
        return this.userService.create(user);
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