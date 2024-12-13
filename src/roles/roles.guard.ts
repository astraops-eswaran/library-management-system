import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "./role.enum";
import { ROLES_KEY } from "./roles.decorator";



@Injectable()
export class RolesGuard implements CanActivate{
    //canActivate is a method that is used to check if the user has the required role to access the route
    constructor(private reflector:Reflector) {}
    //this gurd is used to check the role of the user to access the rout
    canActivate(context:ExecutionContext):boolean{
        //get the roles from the reflector
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if(!requiredRoles){
            return true;
        }
        //get the user from the request
        const { user } = context.switchToHttp().getRequest();
        if (!user || !requiredRoles.some((role) => user.roles?.includes(role))) {
            console.log(user.roles);
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                message: "You do not have the required permissions to access this resource.",
            }, 
            HttpStatus.FORBIDDEN
        );
    }
        return true;
    }
}
