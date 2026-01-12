import { UserDto } from "../../auth/models/user.model"

export interface DocumentUpsertDto {
    documentId: number
    title: string
}

export interface DocumentUserDto {
    documentId: number
    title: string
    lastSeenAt: string
    user?: UserDto;
}