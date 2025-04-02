export interface User {
  id: string;
  username?: string;
  full_name?: string;
  avatar?: string;
}

export interface Review {
  id: string;
  user_id: string;
  project_id: string;
  review: string;
  rating: string;
  created_at: string;
  username?: string;
  full_name?: string;
  avatar?: string;
}

export interface Contributor {
  id: string;
  user_id: string;
  project_id: string;
  username?: string;
  full_name?: string;
  avatar?: string;
  status?: string;
  created_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_link: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  category?: string;
  created_at: string;
  owner?: User;
  contributors: Contributor[];
  reviews: Review[];
  images: string[];
}

export interface ProjectFormData {
  title: string;
  description: string;
  category?: string;
  image?: string;
}

export interface ReviewFormData {
  review: string;
  rating: string;
}
