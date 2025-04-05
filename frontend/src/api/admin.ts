import apiClient from './client';

export interface AdminDashboardMetrics {
  total_users: number;
  total_projects: number;
  total_reviews: number;
  recent_users: number;
  recent_projects: number;
}

export interface AdminUserUpdate {
  is_admin: boolean;
}

export const getAdminMetrics = async (): Promise<AdminDashboardMetrics> => {
  const response = await apiClient.get('/admin/metrics');
  return response.data;
};

export const getAllUsers = async (limit: number = 100, offset: number = 0) => {
  const response = await apiClient.get(`/admin/users?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getAllProjects = async (limit: number = 100, offset: number = 0) => {
  const response = await apiClient.get(`/admin/projects?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const toggleUserAdminStatus = async (userId: string, isAdmin: boolean) => {
  const response = await apiClient.put(`/admin/users/${userId}/admin`, { is_admin: isAdmin });
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await apiClient.delete(`/admin/users/${userId}`);
  return response.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await apiClient.delete(`/admin/projects/${projectId}`);
  return response.data;
};