import apiClient from './client';

export interface RegisterData {
  email: string;
  username: string;
  full_name: string;
  password: string;
  bio?: string;
  avatar?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = async (userData: RegisterData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials: LoginData) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};
