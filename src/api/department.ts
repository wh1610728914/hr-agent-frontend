import type { Response } from "./auth"
import request from "./request"

export interface DepartmentListRequest {
    page: number
    size: number
}
export function getDepartmentList(data: DepartmentListRequest) {
    return request.get<Response>('/depart/list', data)
}