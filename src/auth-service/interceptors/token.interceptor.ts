import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

export interface AuthConfiguredRequest<Params, ResBody = any, ReqBody = any> extends Request<Params, ResBody, ReqBody> {
    userAuthData: {
        id: number,
        firstName: string,
        lastName: string,
        iat: number,
        exp: number
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

    request.userAuthData = {
        ...userData,
    };

    return next.handle()
  }
}