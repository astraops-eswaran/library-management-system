import { Body, Controller, Post, UseGuards, Req} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "../common/dto/login.dto";
import { RegisterDto } from "../common/dto/register.dto";
import { Public } from "../common/is-public.decorator";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { User } from "../users/schema/user.schema";


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // @Public()
    // @Post('register')
    // signUp(@Body() registerDto: RegisterDto) {
    //     return this.authService.signUp(registerDto);
    // }
    @Public()
    @Post('register')
    async signUp(
    @Body() registerDto: RegisterDto,
    @Req() request: any
    ): Promise<{ message: string; user: User }> {
        const requestingUser = request.user; 
        const requestingUserRole = requestingUser?.role;
        return this.authService.signUp(registerDto, requestingUserRole);
    }

    
    @Public()
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
    
    @Public()
    @Post('logout')
    @UseGuards(JwtAuthGuard) 
    async logout(@Req() req: any) {
        const token = req.headers.authorization.split(' ')[1];
        return this.authService.logout(token);
    }
}   