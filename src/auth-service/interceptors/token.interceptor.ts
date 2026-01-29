import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export interface AuthConfiguredRequest<Params, ResBody = any, ReqBody = any> extends Request<Params, ResBody, ReqBody> {
    userAuthData: {
        id: number,
        nUame: string,
        lastName: string,
        iat: number,
        exp: number,
        refresh_token: string
    }
}

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers
    const access_token = headers['authorization']?.replace('Bearer', '').trim()
    const userData = this.jwtService.decode(access_token)


    const refresh_token = request.headers['cookie']

    // console.log(refresh_token, 'refresh token')


    console.log('intercept!!!')
    request.userAuthData = {
        ...userData,
        refresh_token
    };

    console.log(request.body, 'req body')
    console.log(request.originalUrl, 'req body')

    return next.handle()
  }
}