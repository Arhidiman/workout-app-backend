import { Controller, Get, Post, Headers } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {

    private userService: UserService
    
    constructor (userService: UserService) {
        this.userService = userService
    }

    @Post('sign-in')
    async signIn() {
        return await this.userService.signIn()
    }

    @Post('sign-up')
    async signUp() {
        console.log('try to sign up')
        return await this.userService.signUp({ firstName: 'dimon', lastName: 'arch', password: '123'})
    }

    @Get('validate')
    async validate(@Headers('cookie') cookie: string) {
        console.log(cookie, 'its cookie')
        return cookie
    }
}
