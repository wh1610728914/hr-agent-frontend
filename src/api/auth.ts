import type { User } from "@/stores/user";
import request from "./request";

export interface LoginData {
    email: string
    password: string
}
export interface Data {
    access_token: string
    user: User
}
export interface LoginResponse {
    code: number
    message: string
    data: Data


}
// 
export function loginApi(data: LoginData) {
    return request.post<LoginResponse>('/auth/login', data)
}