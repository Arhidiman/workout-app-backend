import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest()

        const response = context.switchToHttp().getResponse()

        console.log(response.getHeader('authorization'), "response.getHeader('authorization')")

        const headers = request.headers


        const tokens = headers['Authorization']


        console.log(tokens, 'tokens')
        if (!tokens) {
            throw new BadRequestException('Credentials not provided')
        }

        this.jwtService.decode(tokens)

        console.log(headers, 'headers')

        return true
        return Math.random() > 0.5
        // return validateRequest(request);
    }
}