import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "./user.entity"
import { JwtService } from '@nestjs/jwt';
import type { Repository } from "typeorm"
import type { TUserDto, ValidationData } from "./dto";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>,

        private jwtService: JwtService
    ) {}

    async signIn() {
        return { id: 1, username: 'admin' }
    }

    async signUp(userData: TUserDto) {     
        const user = await this.userRepository.create(userData)
        const savedUser = await this.userRepository.save({ ...user })
        const { firstName, lastName, id } = savedUser

        const userAuthData = { firstName, lastName, id }
        const access_token = await this.jwtService.signAsync(userAuthData)
        const refresh_token = await this.jwtService.signAsync(userAuthData)

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
