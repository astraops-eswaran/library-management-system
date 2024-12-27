import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "../common/is-public.decorator";



@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private jwtService:JwtService,
        private reflector:Reflector
    ){}
    
    async canActivate(context:ExecutionContext):Promise<boolean>{

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if(isPublic){
            //
            return true;
        }    

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        const token = this.extractTokenFromHeader(request);

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }

        if(!token){
            throw new UnauthorizedException('Unauthorized access to the library for this user');
        }
        
        try{
            const payload = await this.jwtService.verifyAsync(
                token,
                {secret:process.env.JWT_SECRET}
            );
            request['user'] = payload;
        }catch(error){
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired please login again');
            }
            throw new UnauthorizedException('Invalid token');
        }
        return true;    
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}   