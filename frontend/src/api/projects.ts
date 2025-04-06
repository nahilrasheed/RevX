import apiClient from './client';

export interface ProjectData {
  title: string;
  description: string;
  tags?: string[]; // Add tags
  images?: string[]; // Add images
}

export interface ProjectUpdateData {
  title?: string;
  description?: string;
  tags?: string[]; // Add tags
  images?: string[]; 
}
export interface ReviewData {
  review: string;
  rating: string;
}

export const getProjects = async () => {
  const response = await apiClient.get('/project/list');
  return response.data;
};

export const getProject = async (id: string) => {
  const response = await apiClient.get(`/project/get/${id}`);
  return response.data;
};

export const createProject = async (projectData: ProjectData) => {
  const response = await apiClient.post('/project/create', projectData);
  return response.data;
};

export const addReview = async (projectId: string, reviewData: ReviewData) => {
  const response = await apiClient.post(`/project/add_review/${projectId}`, reviewData);
  return response.data;
};

export const removeReview = async (reviewId: string) => {
  const response = await apiClient.delete(`/project/remove_review/${reviewId}`);
  return response.data;
};

export const addContributor = async (projectId: string, data: { username: string }) => {
  const response = await apiClient.post(`/project/add_contributor/${projectId}`, data);
  return response.data;
};

export const updateProject = async (projectId: string, projectData: ProjectUpdateData) => {
  const response = await apiClient.put(`/project/update/${projectId}`, projectData);
  return response.data;
};

export const removeContributor = async (projectId: string, contributorId: string) => {
  const response = await apiClient.delete(`/project/remove_contributor/${projectId}/${contributorId}`);
  return response.data;
};

export const getMyProjects = async () => {
  const response = await apiClient.get('/user/my_projects');
  return response.data;
};

export const getTags = async () => {
  const response = await apiClient.get('/project/tags');
  return response.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await apiClient.delete(`/project/delete/${projectId}`);
  return response.data;
};