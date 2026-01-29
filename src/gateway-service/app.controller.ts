import { Controller, Get, All, UseGuards, Req, Res } from '@nestjs/common';
import { AppService } from './app.service'
import { AuthGuard } from './guards/auth.guard';
import type { Request, Response } from 'express';

@Controller()
// @UseGuards(AuthGuard)
export class AppController {
    constructor(private readonly appService: AppService) {}

    @All('*')
    async handle(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        console.log('@ get request')


        return await this.appService.proxy(req, res);
    }
}