import apiClient from './client';

export interface ProjectData {
  title: string;
  description: string;
  category?: string;
  image?: string;
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

export const addContributor = async (projectId: string, contributorId: string) => {
  const response = await apiClient.post(`/project/add_contributor/${projectId}`, {
    contributor_id: contributorId
  });
  return response.data;
};
