import { config } from '@/src/app/config';
import { ApiResponse, UserProfile } from '@/src/app/types';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthHeader = () => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${config.auth.tokenKey}=`))
    ?.split('=')[1];

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
  };
};

export const api = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> => {
    const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },
};

export const userService = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    return api.get<UserProfile>('/api/user/profile');
  },
}; 