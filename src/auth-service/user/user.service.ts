import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { JwtService } from '@nestjs/jwt';
import { User } from "./user.entity"
import { SessionService } from "../session/session.service";
import type { Repository } from "typeorm"
import type { 
    SignInRequest, 
    SignUpRequest,
    SignInResponse, 
    SignUpResponse, 
    JWTAuthPayload,
    AuthResponse
} from "./types";
import { Role } from "../role/role.entity";

@Injectable()
export class UserService {
    constructor(
        private sessionService: SessionService,

        private jwtService: JwtService,

        @InjectRepository(User) 
        private userRepository: Repository<User>,

        @InjectRepository(Role) 
        private roleRepository: Repository<Role>,
    ) {}

    async signIn(request: SignInRequest): Promise<SignInResponse> {
        console.log(request, 'sign in request')
        const { user_name, password } = request
        const user = await this.userRepository.findOne({ where: { user_name, password }})
        if (!user) throw new UnauthorizedException('Incorrect login or password')  
        return await this.createUserSession(user)
    }

    async signUp(userData: SignUpRequest): Promise<SignUpResponse> {            
        const defaultRole = 'user'
        const role = await this.roleRepository.findOne({ where: { role_name: defaultRole }})

        if (!role) throw new InternalServerErrorException(`Role "${defaultRole}" does not extist`)
        const testUser = await this.userRepository.create({ ...userData, role_id: role.id })
        const savedUser = await this.userRepository.save(testUser)

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

    async refresh(refresh_token: string) {
        const { id, user_name, user_role }: JWTAuthPayload = await this.jwtService.decode(refresh_token)
        return await this.createUserSession({ id, user_name, user_role })
    }

    private async createUserSession(user: User | JWTAuthPayload): Promise<AuthResponse> {
        const { id, user_name } = user

        const role = await this.userRepository 
            .createQueryBuilder('app_users') 
            .innerJoinAndSelect('app_users.role_id', 'role') 
            .select('role.role_name AS "user_role"')
            .where('app_users.id = :id', { id }) 
            .getRawOne()


        const { user_role } = role

        if (!user_role) throw new InternalServerErrorException(`Cannot find user's ${user_name} role`)
        const jwtPayload: JWTAuthPayload = { id, user_name, user_role }
        const tokens = await this.generateTokenPair(jwtPayload)
        await this.sessionService.create({ user_id: user.id, refresh_token: tokens.refresh_token})

        return tokens
    }

    private async generateTokenPair(payload: JWTAuthPayload, refreshInterval: string = '60s') {
        return {
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: await this.jwtService.signAsync(payload)
        }
    }
}
