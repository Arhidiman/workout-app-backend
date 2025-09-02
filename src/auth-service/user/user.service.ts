import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { JwtService } from '@nestjs/jwt';
import { User } from "./user.entity"
import { SessionService } from "../session/session.service";
import type { Response } from "express";
import type { Repository } from "typeorm"
import type { 
    SignInRequest, 
    SignInResponse, 
    SignUpResponse, 
    UserDto, 
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

        if (user) {
            return {
                access_token: await this.jwtService.signAsync(jwtPayload),
                refresh_token: await this.jwtService.signAsync(jwtPayload, { expiresIn: '1d' })
            }
        }
    }

    async signUp(userData: UserDto): Promise<SignUpResponse> {     
        const user = await this.userRepository.create(userData)
        const savedUser = await this.userRepository.save({ ...user })
        const { firstName, lastName, id } = savedUser

        const userAuthData = { firstName, lastName, id }
        const access_token = await this.jwtService.signAsync(userAuthData)
        const refresh_token = await this.jwtService.signAsync(userAuthData, { expiresIn: '1d' })

        return { access_token, refresh_token }
    }

    async validate({ token }: ValidationData) {
        try {
            await this.jwtService.verifyAsync(token)
    
        } catch(err) {
            console.log(err.message, 'validation error')
            throw new UnauthorizedException(`Access denied. ${err.message}`)
        }
    }
}
