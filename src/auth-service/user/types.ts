
import { User } from "./user.entity"

export type SignUpResponse = {
    access_token: string,
    refresh_token: string
}

export type SignInResponse = SignUpResponse
export type AuthResponse = SignInResponse

export type SignUpRequest = Omit<User, 'id' | 'access_token' | 'refresh_token'>
export type SignInRequest = Omit<SignUpRequest, 'lastName'>

export type ValidationData = {
    token: string
}

export type JWTAuthPayload = {
    id: number,
    firstName: string,
    lastName: string
}


export type UserData = Omit<User, 'id'>