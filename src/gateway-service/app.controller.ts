import { Controller, Get, All, UseGuards } from '@nestjs/common';
import { AppService } from './app.service'
import { AuthGuard } from './guards/auth.guard';
import type { Request } from 'express';

@Controller()
// @UseGuards(AuthGuard)
export class AppController {
    constructor(private readonly appService: AppService) {}

    @All('*')
    handle(req: Request) {
        return this.appService.proxyAuth(req);
    }
}