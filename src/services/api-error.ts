import type { AxiosError } from 'axios';

export type ApiErrorDetail = { path: string; message: string };

export type ApiErrorBody = {
  success: false;
  error?: {
    code: string;
    message: string;
    details?: ApiErrorDetail[] | null;
  };
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details: ApiErrorDetail[] | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  const axiosError = error as AxiosError<ApiErrorBody>;
  if (axiosError.response) {
    const status = axiosError.response.status;
    const body = axiosError.response.data?.error;
    return new ApiError(
      status,
      body?.code || 'UNKNOWN_SERVER_ERROR',
      body?.message || `Request failed with status ${status}`,
      body?.details || null,
    );
  }

  if (axiosError.request) {
    return new ApiError(
      0,
      'NETWORK_ERROR',
      'Unable to connect to the server. Please check your internet connection or backend status.',
      null,
    );
  }

  return new ApiError(
    500,
    'UNEXPECTED_ERROR',
    (error as Error)?.message || 'An unexpected error occurred.',
    null,
  );
}

