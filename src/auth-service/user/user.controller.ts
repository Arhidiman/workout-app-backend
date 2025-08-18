import { Controller, Get, Post, Headers, Body, Req } from "@nestjs/common";
import { UserService } from "./user.service";

type TUserDto = {
    firstName: string, 
    lastName: string, 
    password: string
}

@Controller('user')
export class UserController {

    private userService: UserService
    
    constructor (userService: UserService) {
        this.userService = userService
    }

    @Get('statistics')
    async statistics(@Req() req) {
        console.log('try to sign up')
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
        console.log('try to sign up')
        // return '123'
        return await this.userService.signUp(req.body)
    }

    @Post('validate')
    async validate(@Headers() headers: string) {

        console.log(headers, 'headers')

        const token = headers['authorization']?.replace('Bearer', '').trim()
        console.log(token, 'token')

        const validationResult = await this.userService.validate(token)

        console.log(validationResult, 'validationResult')

        return headers
    }
}
