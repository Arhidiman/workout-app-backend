import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "./user.entity"
import type { Repository } from "typeorm"

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>
    ) {}

    async signIn() {
        return { id: 1, username: 'admin'}
    }

    async signUp(userData) {
        const user =  await this.userRepository.create(userData)
        await this.userRepository.save(user)
        return user
    }
}