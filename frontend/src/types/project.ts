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

export interface Tag {
  tag_id: number; 
  tag_name: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  tags: Tag[]; 
  created_at: string;
  owner?: User;
  contributors: Contributor[];
  reviews: Review[];
  images: string[];
  avg_rating?: number; // Ensure avg_rating is included if used elsewhere
}

export interface ProjectFormData {
  title: string;
  description: string;
  tags?: string[]; // Add tags as array of strings for creation/update
  image?: string; // Keep image if needed for initial upload, though images are handled separately
  images?: string[]; // Add images array
}

export interface ReviewFormData {
  review: string;
  rating: string;
}
