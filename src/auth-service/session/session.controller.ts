import { 
    Controller, 
    Get, 
    Post, 
    Put, 
    Delete,
    Body, 
    Req,
    UseInterceptors,
} from "@nestjs/common";
import { SessionService } from "./session.service";
import { TokenInterceptor } from "../interceptors/token.interceptor";

import type { AuthConfiguredRequest } from "../interceptors/token.interceptor";
import { JwtService } from "@nestjs/jwt";

@Controller('user/session')
@UseInterceptors(TokenInterceptor)
export class SessionController {
    constructor (
        private sessionService: SessionService,
        private jwtService: JwtService
    ) {}

    @Get('all')
    async getAll(@Req() req: AuthConfiguredRequest<any, any, undefined>) {
        return this.sessionService.getAll()
    }

    @Post('create')
    async create(@Req() req: AuthConfiguredRequest<any, any, any>) {
        console.log(req.headers, 'session create headers')
        return await this.sessionService.create({ user_id: req.userAuthData.id, refresh_token: '123' })
    }

    @Get('/:id')
    async getOne(@Req() req) {
        const getAccessToken = (request: Request) => {
            const authHeader = request.headers['authorization']
            return authHeader?.split(' ')[1]
        }

        const getRefreshToken = (request: Request) => {
            const cookieHeader = request.headers['cookie']
            return cookieHeader
                ?.split(';')
                .find(c => c.includes('refresh_token'))
                .split('=')[1]
        }
        return this.sessionService.getById(req.params.id)
    }

    @Put('/:id')
    async update(@Req() req) {
        return
    }

    @Delete('/:id')
    async signUp(@Body() body) {
        return
    }
}
