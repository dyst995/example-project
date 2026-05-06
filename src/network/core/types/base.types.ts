import type { RequestHeaders } from '../../core';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  headers?: RequestHeaders;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export type ApiResult<T> = Promise<ApiResponse<T>>;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
