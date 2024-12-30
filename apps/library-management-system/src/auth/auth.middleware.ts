import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";



@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(
        private readonly jwtService:JwtService,
        private readonly authService:AuthService
    ){}
    async use(req: any, res: any, next: () => void) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token is missing');
        }

        // Check if the token is blacklisted
        if (this.authService.isTokenBlocklisted(token)) {
            throw new UnauthorizedException('Token is invalid or has been logged out');
        }

        try {
            const decoded = await this.jwtService.verifyAsync(token);
            req.user = decoded;
            next();
        } catch (err) {
            throw new UnauthorizedException('Token verification failed');
        }
    }
}