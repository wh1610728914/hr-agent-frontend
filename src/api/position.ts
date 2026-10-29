// 职位方面的
import request from "./request";
import type { NormalPageRequest } from "./request";
import type { PageResponse } from "./user";
export interface PositionResponse {
    id: string
    title: string
    min_salary: number
}
export function getPositionListApi(data: NormalPageRequest) {
    // 获取职位列表
    return request.get<PageResponse<PositionResponse>>('/position/list', data)
}