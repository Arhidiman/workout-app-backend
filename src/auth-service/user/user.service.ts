import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { JwtService } from '@nestjs/jwt';
import { User } from "./user.entity"
import { SessionService } from "../session/session.service";
import type { Response } from "express";
import type { Repository } from "typeorm"
import type { 
    SignInRequest, 
    SignUpRequest,
    SignInResponse, 
    SignUpResponse, 
    ValidationData 
} from "./types";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>,
        private sessionService: SessionService,
        private jwtService: JwtService
    ) {}

    async signIn(request: SignInRequest): Promise<SignInResponse | undefined> {
        const { firstName, password } = request
        const user = await this.userRepository.findOne({ where: { firstName, password }})

        if (!user) throw new UnauthorizedException('Incorrect login or password')
            
        const jwtPayload = { id: user?.id, firstName, password }

        if (user) return this.generateTokenPair(jwtPayload)
    }

    async signUp(userData: SignUpRequest): Promise<SignUpResponse> {            
        const user = await this.userRepository.create(userData)
        const savedUser = await this.userRepository.save({ ...user })
        const { firstName, lastName, id } = savedUser

        const userAuthData = { firstName, lastName, id }

        return this.generateTokenPair(userAuthData)
    }

    async validate(token: string) {
        try {
            await this.jwtService.verifyAsync(token)
    
        } catch(err) {
            console.log(err.message, 'validation error')
            throw new UnauthorizedException(`Access denied. ${err.message}`)
        }
    }

    // TODO: допилить
    async refresh() {
        return this.generateTokenPair({})
    }

    private async generateTokenPair(payload: any, refreshInterval: string = '1d') {
        return {
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: await this.jwtService.signAsync(payload, { expiresIn: refreshInterval })
        }
    }
}
