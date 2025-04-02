import apiClient from './client';

export interface UserProfileUpdateData {
  username?: string;
  full_name?: string;
  bio?: string;
  avatar?: string;
}

export const updateUserProfile = async (userData: UserProfileUpdateData) => {
  const response = await apiClient.put('/user/update', userData);
  return response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await apiClient.post('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword
  });
  return response.data;
};
