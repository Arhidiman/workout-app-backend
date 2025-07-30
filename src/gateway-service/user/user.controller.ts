import { Get, Post, Controller, Request } from "@nestjs/common"
import { Response, Request as Req, NextFunction } from 'express';
// import { UserService } from "src/auth-service/user/user.service";

@Controller()
export class UserController {

    // constructor(private userService: UserService) {}

    @Post('user')
    async signUp(@Request() req: Req) {
        // await this.userService.signUp(req.body)
    }

    @Post('/user:id')
    async signInUser(req: Request, res: Response) {
        const id = req
        return `hi user with id ${id}`
    }

}