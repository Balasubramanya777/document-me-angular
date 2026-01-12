import { UserDto } from "./user.model"

export interface SignUpRequest {
    userName: string
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface SignInRequest {
    userName: string
    password: string
}

export interface SignInResponse {
    accessToken: string
    user: UserDto
}
