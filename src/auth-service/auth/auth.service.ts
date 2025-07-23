import { Injectable } from "@nestjs/common"

@Injectable()
export class AuthService {


    async signIn() {
        return { id: 1, username: 'admin'}
    }

    async signUp() {
        return { id: 1, username: 'admin'}
    }

}