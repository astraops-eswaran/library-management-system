import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve required roles for the route
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Extract the user from the request
    const { user } = context.switchToHttp().getRequest();

    // Check if user or roles are missing
    if (!user || !user.role) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'User not authenticated or roles not assigned.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // Check if the user has at least one of the required roles
    const hasRole = requiredRoles.some((role) => user.role.includes(role));

    if (!hasRole) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'You do not have the required permissions to access this resource.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return true; // Grant access
  }
}
