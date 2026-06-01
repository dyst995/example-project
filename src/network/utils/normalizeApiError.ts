import type { ApiError } from '../core/types';

const DEFAULT_MESSAGE = 'An error occurred';
const DEFAULT_STATUS = 500;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readAxiosResponse = (error: unknown) => {
  if (!isRecord(error) || !isRecord(error.response)) {
    return undefined;
  }

  return error.response;
};

export const normalizeApiError = (error: unknown): ApiError => {
  if (isRecord(error) && typeof error.message === 'string' && typeof error.status === 'number') {
    return {
      message: error.message,
      status: error.status,
      errors: isRecord(error.errors)
        ? (error.errors as Record<string, string[]>)
        : undefined,
    };
  }

  const response = readAxiosResponse(error);
  const responseData = isRecord(response?.data) ? response.data : undefined;
  const message =
    typeof responseData?.message === 'string' ? responseData.message : DEFAULT_MESSAGE;
  const status = typeof response?.status === 'number' ? response.status : DEFAULT_STATUS;
  const errors = isRecord(responseData?.errors)
    ? (responseData.errors as Record<string, string[]>)
    : undefined;

  return { message, status, errors };
};

export const isApiError = (error: unknown): error is ApiError =>
  isRecord(error) && typeof error.message === 'string' && typeof error.status === 'number';
