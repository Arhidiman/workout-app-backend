
import { User } from "./user.entity"


export type SignUpResponse = {
    access_token: string,
    refresh_token: string
}

export type SignInResponse = SignUpResponse

export type UserDto = {
    firstName: string, 
    lastName: string, 
    password: string
}


export type SignUpRequest = Omit<User, 'id' | 'access_token' | 'refresh_token'>
export type SignInRequest = Omit<SignUpRequest, 'lastName'>

export type ValidationData = {
    token: string
}


export type UserData = Omit<User, 'id'>