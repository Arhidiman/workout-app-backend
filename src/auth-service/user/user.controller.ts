import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Headers, 
    Body, 
    Req,
    UseInterceptors 
} from "@nestjs/common";
import { UserService } from "./user.service";
import { TokenInterceptor } from "../interceptors/token.interceptor";
import type { IncomingHttpHeaders } from "http";
import type { Request } from "express";
import type { TUserDto } from "./dto";

interface AuthConfiguredRequest extends Request {
    userAuthData: {
        firstName: string,
        lastName: string
    }
}

@Controller('user')
@UseInterceptors(TokenInterceptor)
export class UserController {

    private userService: UserService
    
    constructor (userService: UserService) {
        this.userService = userService
    }

    @Get('statistics')
    async statistics(@Req() req: AuthConfiguredRequest) {
        console.log('try to get stats')
        console.log(req.userAuthData, 'req userAuthData')
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
    async signIn(@Body() body: TUserDto) {
        console.log('try to sign in')
        // return 'sign in response'
        return await this.userService.signIn()
    }

    @Post('sign-up')
    async signUp(@Req() req) {
        // console.log('try to sign up')
        // return '123'
        console.log(req.body, 'request body')
        return await this.userService.signUp(req.body)
    }

    @Post('validate')
    async validate(@Headers() headers: IncomingHttpHeaders) {

        // console.log('validation process')

        // console.log(headers, 'headers')

        const token = headers['authorization']?.replace('Bearer', '').trim()
        // console.log(token, 'token')

        // console.log(token, 'token')

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
