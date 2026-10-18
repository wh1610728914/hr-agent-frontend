import { defineStore } from "pinia";

export interface User {
    id: number
    username: string
    email: string
    phone_number: string | null
    realname: string
    avatar: string | null
    status: string
    is_hr: boolean
    is_superuser: boolean
    create_at: string
}
export interface UserState {
    user: null | User
    accessToken: string | null
}
export const useUserStore = defineStore('user', {
    state: (): UserState => {
        // 存放数据
        const user = localStorage.getItem('user')
        const accessToken = localStorage.getItem('accessToken')
        return {
            user: user ? JSON.parse(user) : null,
            accessToken: accessToken || null
        }
    },
    getters: {
        // 类似 computed
        isLoggedIn(): boolean {
            return !!this.accessToken
        },
        getUserInfo(): User | null {
            return this.user
        },
        getAccessToken(): string | null {
            return this.accessToken
        },
        isHr(): boolean {
            return this.user?.is_hr || false
        },
        isSuperUser(): boolean {
            return this.user?.is_superuser || false
        }
    },
    actions: {
        // 方法，可同步异步，类似 methods
        login(user: User, accessToken: string) {
            // 登录
            this.user = user
            this.accessToken = accessToken
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('accessToken', accessToken)
        },
        logout() {
            // 退出登录
            this.user = null
            this.accessToken = null
            localStorage.removeItem('user')
            localStorage.removeItem('accessToken')
        }
    }
})