
import { User } from "./user.entity"

export type SignUpResponse = {
    access_token: string,
    refresh_token: string
}

export type SignInResponse = SignUpResponse
export type AuthResponse = SignInResponse

export type SignUpRequest = Omit<User, 'id' | 'role' | 'role_id'>
export type SignInRequest = SignUpRequest

export type ValidationData = {
    token: string
}

export type JWTAuthPayload = {
    id: number,
    user_name: string,
    user_role: string
}


export type UserData = Omit<User, 'id'>