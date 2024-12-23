import { Body, Controller, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "../common/dto/login.dto";
import { RegisterDto } from "../common/dto/register.dto";
import { Public } from "../common/is-public.decorator";



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('register')
    signUp(@Body() registerDto: RegisterDto) {
        return this.authService.signUp(registerDto);
    }

    @Public()
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
 
}   