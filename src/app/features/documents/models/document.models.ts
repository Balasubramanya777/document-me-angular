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

export interface ContentCreateDto {
    documentId: number
    updates?: string[]
    snapshot?: string
}

export interface ContentDto{
    documentId: number
    title: string
    updates?: string[]
    snapshot?: string
}