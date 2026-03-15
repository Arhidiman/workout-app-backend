import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { appConfig } from '../../config';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        await this.validateRequest(request)
        return true
    }

    private isPublicRoute(endpoint: string): boolean {
        return  Object.values(appConfig.publicRoutes).some(r => endpoint.includes(r))
    }


    private async validateJWT(headers: Headers) {
        const authHeader = headers['authorization']
        if (!authHeader) throw new BadRequestException('Credentials not provided')
        const token = this.getToken(authHeader)
        await this.jwtService.verifyAsync(token).catch(err => { throw new BadRequestException(err.message) })
    }

    private async validateRequest(request: Request) {
        const headers = request.headers
        if (!this.isPublicRoute(request.url)) {
            await this.validateJWT(headers)
        }
        return true
    }

    private getToken (authHeader: string) {
        return authHeader.replace('Bearer', '').trim()
    }

}