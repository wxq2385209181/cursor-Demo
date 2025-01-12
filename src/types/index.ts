// 定义通用的接口和类型
export interface IResponse<T = any> {
    code: number;
    data: T;
    message: string;
}

export interface IUserInfo {
    username: string;
    avatar?: string;
    roles: string[];
} 