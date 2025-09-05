import { 
    Controller, 
    Post, 
    Headers, 
    Body, 
    Req,
    Res,
} from "@nestjs/common";
import { UserService } from "./user.service";
import type { IncomingHttpHeaders } from "http";
import type { SignUpRequest, AuthResponse } from "./types";
import type { Response } from "express";

@Controller('user')
export class UserController {

    constructor (private userService: UserService) {}

    @Post('sign-in')
    async signIn(@Body() body: SignUpRequest, @Res() response: Response) {
        const { access_token, refresh_token} = await this.userService.signIn(body) || {}  
        this.authResponse(response, { access_token, refresh_token })
    }

    @Post('sign-up')
    async signUp(@Body() body: SignUpRequest, @Res() response: Response) {
        const { access_token, refresh_token} = await this.userService.signUp(body)
        this.authResponse(response, { access_token, refresh_token })
    }

    @Post('refresh')
    async refresh(@Req() request: Request, @Res() response: Response) {

        const token = request.headers['cookie']

        console.log(token, 'refresh token')

        return 'refreshed !!!!'
        // const { access_token, refresh_token} = await this.userService.refresh(token) || {}  
        // this.authResponse(response, { access_token, refresh_token })
    }

    @Post('validate')
    async validate(@Headers() headers: IncomingHttpHeaders) {

        console.log('try to validate token')
        const token = headers['authorization']?.replace('Bearer', '').trim()
        this.userService.validate(token || '' )
        return
    }

    private authResponse(response: Response, { access_token, refresh_token }: AuthResponse) {
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
