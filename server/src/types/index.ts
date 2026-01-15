// 共享类型定义

export interface JwtPayload {
  userId: string;
  username: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}
