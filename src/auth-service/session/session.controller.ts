import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete,
    Headers, 
    Body, 
    Req,
    UseInterceptors,
    UnauthorizedException,
    Res
} from "@nestjs/common";
import { SessionService } from "./session.service";
import { TokenInterceptor } from "../interceptors/token.interceptor";
import type { IncomingHttpHeaders } from "http";
import type { CreateSessionRequest } from "./types";
import type { AuthConfiguredRequest } from "../interceptors/token.interceptor";
import type { Response } from "express";

@Controller('user/session')
@UseInterceptors(TokenInterceptor)
export class SessionController {

    
    constructor (
        private sessionService: SessionService
    ) {}

    @Get('all')
    async getAll(@Req() req: AuthConfiguredRequest<any, any, undefined>) {
        return this.sessionService.getAll()
    }

    @Post('create')
    async create(@Req() req: AuthConfiguredRequest<any, any, any>) {
        console.log(req.headers, 'session create headers')
        return await this.sessionService.create({ userId: req.userAuthData.id, refresh_token: '123' })
    }

    @Put('/:id')
    async update(@Req() req) {
        return
    }

    @Delete('/:id')
    async signUp(@Body() body) {
        return
    }
}
