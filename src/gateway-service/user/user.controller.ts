import { Get, Controller } from "@nestjs/common"

@Controller()
export class UserController {
    @Get('/user')
    getUser(): string {
        return 'hi user'
    }
}