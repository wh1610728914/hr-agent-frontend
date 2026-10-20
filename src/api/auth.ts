import type { User } from "@/stores/user";
import request from "./request";

export interface LoginDataRequest {
    email: string
    password: string
}
export interface Data {
    access_token: string
    user: User
}
export interface Response {
    code: number
    message: string
    data: Data
}
export function loginApi(data: LoginDataRequest) {
    // 登录
    return request.post<Response>('/auth/login', data)
}


export interface RegisterDataRequest {
    email: string
    invite_code: string
    username: string
    realname: string
    password: string
}

// export interface
export function registerApi(data: RegisterDataRequest) {
    // 注册
    return request.post<Response>('/auth/register', data)
}