import { useUserStore } from "@/stores/user"
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios"
import { ElMessage } from "element-plus"

// 和后端约定的统一返回格式
export interface ApiResponse<T = unknown> {
    code: number
    message: string
    data: T
}

// 封装axios 单例+封装 ,外部只拿到一个实例,调用用http
class HttpRequest {
    private instance: AxiosInstance
    public baseURL: string
    constructor() {
        const baseURL = import.meta.env.VITE_API_BASE_URL
        this.baseURL = baseURL
        this.instance = axios.create({
            // 必须是以VITE才可以被访问到 VITE_API_BASE_URL
            baseURL,
            timeout: 300000
        })
        this.setupInterceptors()
    }
    private setupInterceptors() {
        // config 即将发出请求的配置对象
        this.instance.interceptors.request.use((config) => {
            const userStore = useUserStore()
            const token = userStore.accessToken
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        }, (err) => Promise.reject(err))

        this.instance.interceptors.response.use((response) => {
            return response.data
        }, (err) => {
            return Promise.reject(err)
        })
    }
    // request.post的结果的格式最后是LoginResult格式
    // async request.post<LoginResult>
    // config:AxiosRequestConfig 参数是axios的配置对象 { url, method, params, data }
    // : Promise<T> 用async 返回的都是一个包裹的Promise
    async request<T>(config: AxiosRequestConfig): Promise<T> {
        // request<any,T>
        // 第一个是返回的data类型，第二个是整个response的类型
        const response = await this.instance.request<any, T>(config)
        console.log('sssss', response);

        // 强行转为T   as unknown as T 是 TypeScript 里的双重类型断言，它的意思是：“强行转换”。
        return response as unknown as T
    }

    get<T>(url: string, params?: object, config?: AxiosRequestConfig) {
        return this.request<T>(
            { ...config, method: 'GET', url, params }
        )
    }
    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        return this.request<T>(
            { ...config, method: 'POST', url, data }
        )
    }
    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
        return this.request<T>(
            { ...config, method: 'PUT', url, data }
        )
    }
    delete<T>(url: string, params?: unknown, config?: AxiosRequestConfig) {
        return this.request<T>(
            { ...config, method: 'DELETE', url, params }
        )
    }
}
export default new HttpRequest()