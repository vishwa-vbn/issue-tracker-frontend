import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { store } from '@/store';
import { sessionExpired, tokenRefreshed } from '@/store/auth-slice';
import { setServerWaking } from '@/store/ui-slice';
import { toApiError, type ApiErrorBody } from './api-error';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 60_000,
});

type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _timerId?: ReturnType<typeof setTimeout>;
};

let activePendingRequests = 0;

api.interceptors.request.use((config: RetriableConfig) => {
  activePendingRequests++;
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config._timerId = setTimeout(() => {
    store.dispatch(setServerWaking(true));
  }, 4000);

  return config;
});

const cleanupSlowTimer = (config?: RetriableConfig) => {
  activePendingRequests = Math.max(0, activePendingRequests - 1);
  if (config?._timerId) {
    clearTimeout(config._timerId);
    config._timerId = undefined;
  }
  if (activePendingRequests === 0) {
    store.dispatch(setServerWaking(false));
  }
};

let refreshing: Promise<string> | null = null;

export const refreshAccessToken = (): Promise<string> => {
  if (!refreshing) {
    refreshing = axios
      .post(`${baseURL}/auth/refresh`, null, { withCredentials: true })
      .then((res) => {
        const data = res.data.data;
        store.dispatch(tokenRefreshed(data));
        return data.accessToken as string;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
};

api.interceptors.response.use(
  (res) => {
    cleanupSlowTimer(res.config as RetriableConfig);
    return res;
  },
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as RetriableConfig | undefined;
    cleanupSlowTimer(original);

    const code = error.response?.data?.error?.code;
    const isAuthEndpoint =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/register') ||
      original?.url?.includes('/auth/refresh') ||
      original?.url?.includes('/auth/logout');

    if (
      error.response?.status === 401 &&
      (code === 'AUTH_TOKEN_EXPIRED' || code === 'AUTH_UNAUTHORIZED') &&
      original &&
      !original._retry &&
      !isAuthEndpoint
    ) {
      original._retry = true;
      try {
        const newToken = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        store.dispatch(sessionExpired());
      }
    }
    return Promise.reject(toApiError(error));
  },
);

