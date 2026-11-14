import { ApiError } from '@/services/api-error';
import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';

const ERROR_CODE_MAP: Record<string, string> = {
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password.',
  AUTH_TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  AUTH_UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'A record with this information already exists.',
  VALIDATION_ERROR: 'Please check the entered values and fix the errors.',
  USER_EMAIL_TAKEN: 'A user with this email address already exists.',
  USER_SELF_MODIFY: 'You cannot demote or deactivate your own account.',
  USER_LAST_ADMIN: 'Cannot demote or deactivate the last remaining active administrator.',
  USER_NOT_FOUND: 'The specified user was not found.',
  NETWORK_ERROR: 'Unable to connect to the server. Please check your network or wait for server wakeup.',
  UNKNOWN_SERVER_ERROR: 'An unexpected server error occurred. Please try again.',
};

export function messageForError(error: unknown): string {
  if (error instanceof ApiError) {
    if (ERROR_CODE_MAP[error.code]) {
      return ERROR_CODE_MAP[error.code];
    }
    return error.message || 'An error occurred. Please try again.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred.';
}

export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): void {
  if (error instanceof ApiError && error.details && Array.isArray(error.details)) {
    for (const detail of error.details) {
      if (detail.path && detail.message) {
        setError(detail.path as Path<T>, {
          type: 'server',
          message: detail.message,
        });
      }
    }
  }
}

