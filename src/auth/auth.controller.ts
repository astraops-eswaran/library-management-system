import { Body, Controller, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto} from "src/common/dto/register.dto";
import { LoginDto } from "src/common/dto/login.dto";
import { Public } from "src/common/is-public.decorator";


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