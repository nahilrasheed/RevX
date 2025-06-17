-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE revx.contributors (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  project_id bigint NOT NULL,
  status boolean NOT NULL DEFAULT false,
  CONSTRAINT contributors_pkey PRIMARY KEY (id),
  CONSTRAINT contributors_project_id_fkey FOREIGN KEY (project_id) REFERENCES revx.projects(id),
  CONSTRAINT contributors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE revx.profile (
  id uuid NOT NULL,
  username character varying NOT NULL UNIQUE,
  full_name character varying NOT NULL,
  bio text,
  avatar character varying,
  is_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profile_pkey PRIMARY KEY (id),
  CONSTRAINT profile_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE revx.project_R_tag (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  project_id bigint NOT NULL,
  tag_id bigint NOT NULL,
  CONSTRAINT project_R_tag_pkey PRIMARY KEY (id),
  CONSTRAINT project_R_tags_project_id_fkey FOREIGN KEY (project_id) REFERENCES revx.projects(id),
  CONSTRAINT project_R_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES revx.tags(id)
);
CREATE TABLE revx.project_images (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  image_link character varying NOT NULL,
  project_id bigint NOT NULL,
  CONSTRAINT project_images_pkey PRIMARY KEY (id),
  CONSTRAINT project_images_project_id_fkey FOREIGN KEY (project_id) REFERENCES revx.projects(id)
);
CREATE TABLE revx.projects (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title character varying UNIQUE,
  description character varying,
  owner_id uuid NOT NULL,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
CREATE TABLE revx.reviews (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  project_id bigint NOT NULL,
  user_id uuid NOT NULL,
  rating bigint NOT NULL,
  review text NOT NULL,
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT reviews_project_id_fkey FOREIGN KEY (project_id) REFERENCES revx.projects(id)
);
CREATE TABLE revx.tags (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  tag_name character varying NOT NULL UNIQUE,
  CONSTRAINT tags_pkey PRIMARY KEY (id)
);