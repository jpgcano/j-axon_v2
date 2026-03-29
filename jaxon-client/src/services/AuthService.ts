import { api } from '../lib/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const AuthService = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
  
  register: (data: any) => api.post<{message: string}>('/auth/register', data),
};
