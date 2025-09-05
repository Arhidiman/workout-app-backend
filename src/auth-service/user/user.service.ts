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
    ValidationData, 
    JWTAuthPayload,
    AuthResponse
} from "./types";
import { ref } from "process";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>,
        private sessionService: SessionService,
        private jwtService: JwtService
    ) {}

    async signIn(request: SignInRequest): Promise<SignInResponse> {
        const { firstName, password } = request
        const user = await this.userRepository.findOne({ where: { firstName, password }})
        if (!user) throw new UnauthorizedException('Incorrect login or password')  
        return await this.createUserSession(user)
    }

    async signUp(userData: SignUpRequest): Promise<SignUpResponse> {            
        const user = await this.userRepository.create(userData)
        const savedUser = await this.userRepository.save({ ...user })
        return await this.createUserSession(savedUser)
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
    async refresh(refresh_token: string) {

        const { id, firstName, lastName }: JWTAuthPayload = await this.jwtService.decode(refresh_token)

        return this.generateTokenPair({ id, firstName, lastName })
    }

    private async createUserSession(user: User): Promise<AuthResponse> {
        const { id, firstName, lastName } = user

        const jwtPayload: JWTAuthPayload = { id, firstName, lastName }
        const tokens = await this.generateTokenPair(jwtPayload)

        await this.sessionService.create({ userId: user.id, refresh_token: tokens.refresh_token})

        return tokens
    }

    private async generateTokenPair(payload: JWTAuthPayload, refreshInterval: string = '1d') {
        return {
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: await this.jwtService.signAsync(payload, { expiresIn: refreshInterval })
        }
    }
}
