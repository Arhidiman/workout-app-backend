import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Session } from "./session.entity"
import { JwtService } from '@nestjs/jwt';
import type { Response } from "express";
import type { Repository } from "typeorm"
import type { 
    CreateSessionRequest
} from "./types";

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session) 
        private sessionRepository: Repository<Session>,
    ) {}

    async getAll(): Promise<any> {
        return
    }

    async create(data: CreateSessionRequest): Promise<any> { 
        const session = this.sessionRepository.create(data)
        const savedSession = await this.sessionRepository.save(session)
        return savedSession
    }

    async getById(id: number) {
        return this.sessionRepository.findOne({ where: { userId: id } })
    }

    async delete() {
        return
    }
}
