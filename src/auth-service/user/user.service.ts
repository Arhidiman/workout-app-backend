import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "./user.entity"
import { JwtService } from '@nestjs/jwt';
import type { Repository } from "typeorm"


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

    async signUp(userData) {



        const { token } = userData

        const access_token = await this.jwtService.signAsync(userData)
        // const refresh_token = await this.jwtService.signAsync(userData)
        // const user = await this.userRepository.create(userData)
        // await this.userRepository.save(user)

        // const result = await this.jwtService.verifyAsync(token)

        // console.log(result, '!!!')
        return access_token
    }

    async validate(token: string) {

        console.log(token, 'token')

        try {
            await this.jwtService.verifyAsync(token)
        } catch(err) {
            return err.message
        }


    }
}
