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


        console.log(userData, 'user dsata')

        const access_token = await this.jwtService.signAsync(userData)
        const refresh_token = await this.jwtService.signAsync(userData)
        const user = await this.userRepository.create(userData)
        await this.userRepository.save(user)

        // const result = await this.jwtService.verifyAsync(token)

        // console.log(result, '!!!')
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
