import { Get, Post, Controller } from "@nestjs/common"
import { Request, Response, NextFunction } from 'express';

@Controller()
export class UserController {
    @Get('/user')
    getUser(): string {
        return 'hi user'
    }

    @Get('/user:id')
    signInUser(req: Request, res: Response): string {
        const id = req
        return `hi user with id ${id}`
    }

}