import { Controller, Get, Post, Headers, Body } from "@nestjs/common";
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

    @Post('sign-in')
    async signIn(@Body() body: TUserDto) {
        console.log('try to sign in')
        return body
        return await this.userService.signIn()
    }

    @Post('sign-up')
    async signUp(@Body() body: TUserDto) {
        console.log('try to sign up')
        return body
        return await this.userService.signUp(body)
    }

    @Get('validate')
    async validate(@Headers('cookie') cookie: string) {
        return cookie
    }
}
