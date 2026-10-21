import request from "./request"
import type { Response } from '@/api/auth.ts'
export interface UserResponse {
    // 每个user的结构
    id: number
    name: string
    age: number
    email: string
}
export interface UserListRequest {
    page: number
    size: number
    department_id: string
}
export interface PageData<T> {
    list: T[]
    total: number
}
export interface PageResponse<T> {
    code: number
    message: string
    data: PageData<T>
}

export function getUserList(data: UserListRequest) {
    // 获取列表
    return request.get<PageResponse<UserResponse>>('/user/list', data)
}

export interface Status {
    ACTIVE: 'ACTIVE'
    BLOCKED: 'BLOCKED'
    RESIGNED: 'RESIGNED'
}
export interface UpdateRequest {
    user_id: string
    status: Status
}
export function updateUserStatus(data: UpdateRequest) {
    // 修改员工状态
    return request.patch<Response>('/user/update/status', data)
}

export function getHrList(data: UserListRequest) {
    // 获取hr总列表
    return request.get<PageResponse<UserResponse>>('/hr/list', data)
}