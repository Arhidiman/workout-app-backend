import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Headers, 
    Body, 
    Req,
    Res,
    UseInterceptors,
    UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { TokenInterceptor } from "../interceptors/token.interceptor";
import type { IncomingHttpHeaders } from "http";
import type { SignInRequest, SignUpRequest, SignInResponse } from "./types";
import type { AuthConfiguredRequest } from "../interceptors/token.interceptor";
import type { Response } from "express";
import { ref } from "process";
import { SessionService } from "../session/session.service";
import { Session } from "../session/session.entity";

@Controller('user')
@UseInterceptors(TokenInterceptor)
export class UserController {

    constructor (
        private userService: UserService,
        private sessionService: SessionService
    ) {}

    @Post('sign-in')
    async signIn(@Req() req: AuthConfiguredRequest<any, any, SignUpRequest>, @Res() response: Response) {
        const { access_token, refresh_token} = await this.userService.signIn(req.body) || {}  
        this
            .applyTokens(response, { access_token, refresh_token })
            .status(200)
            .send()
    }

    @Post('sign-up')
    async signUp(@Body() body: SignUpRequest, @Res() response: Response) {
        const { access_token, refresh_token} = await this.userService.signUp(body)
        this
            .applyTokens(response, { access_token, refresh_token })
            .status(200)
            .send()
    }

    @Post('validate')
    async validate(@Headers() headers: IncomingHttpHeaders) {
        const token = headers['authorization']?.replace('Bearer', '').trim()
        this.userService.validate(token || '' )
        return
    }

    @Post('refresh')
    async refresh(@Headers() headers, @Res() response: Response) {
        const { access_token, refresh_token} = await this.userService.refresh() || {}  
        this
            .applyTokens(response, { access_token, refresh_token })
            .status(200)
            .send()
    }


    private applyTokens(response: Response, { access_token, refresh_token }) {
        access_token && response.setHeader('authorization', `Bearer ${access_token}`)

        refresh_token && response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false, // true если https
            sameSite: 'lax', // или 'none' если нужны кросс-доменные запросы
            path: '/'
        })

        return response
    }
}
