import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

    authService: AuthService
    constructor () {
        this.authService = new AuthService()
    }

    @Post('sign-in')
    async signIn() {
        return await this.authService.signIn()
    }

    @Post('sign-up')
    async signUp() {
        return await this.authService.signIn()
    }

}
