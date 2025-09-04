import { 
    Injectable, 
    InternalServerErrorException, 
    ForbiddenException,
    NestMiddleware, 
    UnauthorizedException, 
} from '@nestjs/common'

import axios from 'axios'

import type { IncomingHttpHeaders } from 'http'
import type { AxiosResponse } from 'axios'
import type { Request, Response, NextFunction } from 'express'
import type { AuthConfiguredRequest } from '../interceptors/token.interceptor'
import { JwtService } from '@nestjs/jwt'

type AuthResponse = {
    access_token: string,
    refresh_token: string
}

const authBaseUrl = 'http://localhost:8001'
const validateEndpoint = 'user/validate'

const notValidatedUrls = ['user/sign-in', 'user/sign-up']
const authUrls = ['user/sign-in', 'user/sign-up']

const allowedHeaders = [
    'content-type',
    'authorization',
    'cookie'
]

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    
    constructor(private jwtService: JwtService) {}

    async use(request: AuthConfiguredRequest<any, any, any>, response: Response, next: NextFunction) {

        console.log(request.headers, 'req headers')
        const access_token = this.getAccessToken(request)
        const refresh_token = this.getRefreshToken(request)
        try {
            this.jwtService.verify(access_token)
            this.jwtService.verify(refresh_token)
            next()
        } catch(err) {

            if (err.message && err.message.toLowerCase().includes('jwt expired')) {
                throw new ForbiddenException(err.message)
            } else throw new Error(`Auth middleware error.${err.message}`)
        }

    }

    private getAccessToken (request: Request) {
        const authHeader = request.headers['authorization']
        return authHeader?.split(' ')[1] || ''
    }

    private getRefreshToken(request: Request) {
        const cookieHeader = request.headers['cookie']
        const refreshCookie = cookieHeader
            ?.split(';')
            .find(c => c.trim().startsWith('refresh_token='))
    
        return refreshCookie?.split('=')[1] || ''
    }
}