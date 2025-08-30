import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Headers, 
    Body, 
    Req,
    UseInterceptors,
    UnauthorizedException,
    Res
} from "@nestjs/common";
import { UserService } from "./user.service";
import { TokenInterceptor } from "../interceptors/token.interceptor";
import type { IncomingHttpHeaders } from "http";
import type { UserDto, SignInRequest, SignUpRequest, SignInResponse } from "./types";
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

    @Get('statistics')
    async statistics(@Req() req: AuthConfiguredRequest<any, any, undefined>) {
        console.log('try to get stats')
        console.log(req.body, 'req userAuthData')
        return 
        // return await this.userService.signUp(body)
    }

    @Put('statistics')
    async update(@Req() req) {
        console.log('try to get stats')
        return 'here will be user statistics'
        // return await this.userService.signUp(body)
    }

    @Post('sign-in')
    async signIn(@Req() req: AuthConfiguredRequest<any, any, SignUpRequest>, @Res() response: Response) {
        const { access_token, refresh_token} = await this.userService.signIn(req.body) || {}

        if (!access_token || !refresh_token) throw new UnauthorizedException('Incorrect login or password')

        const session: Session = await this.sessionService.create({
            userId: 6,
            refresh_token: refresh_token
        })

        console.log(access_token)

        access_token && response.setHeader('authorization', `Bearer ${access_token}`)

        refresh_token && response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60
        })

        return response.status(200).send()
    }

    @Post('sign-up')
    async signUp(@Body() body: SignUpRequest, @Res() response: Response) {
        const { access_token, refresh_token} = await this.userService.signUp(body)
        if (!access_token || !refresh_token) throw new UnauthorizedException('Registration error.')

        const session: Session = await this.sessionService.create({
            userId: 7,
            refresh_token: refresh_token
        })

        access_token && response.setHeader('authorization', `Bearer ${access_token}`)

        refresh_token && response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60
        })

        return response.status(200).send()
    }

    @Post('validate')
    async validate(@Headers() headers: IncomingHttpHeaders) {
        const token = headers['authorization']?.replace('Bearer', '').trim()

        const validationResult = await this.userService.validate({ token: token || '' })

        return headers
    }

    @Post('refresh')
    async refresh(@Headers() headers) {


        // console.log('validation process')

        // console.log(headers, 'headers')

        const token = headers['authorization']?.replace('Bearer', '').trim()
        // console.log(token, 'token')

        const validationResult = await this.userService.validate(token)

        // console.log(validationResult, 'validationResult')

        return headers
    }
}
