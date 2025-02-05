# SRS DOCUMENT

## Team - 05
```
2023BCY0005 Adil Omar
2023BCY0018 Saumya Shahi
2023BCY0031 Bhaskar Naik
2023BCY0044 Kandarp Jindal
2023BCY0057 Nahil Rasheed
```
## **RevX**

## 1. Introduction

The platform is intended to serve as a robust online hub for peer-driven project sharing and improvement. The platform will allow users to upload completed projects, receive ratings, and feedback, and explore peer submissions. Its primary objectives are to encourage constructive feedback, enhance project quality, and promote the possibility of collaborative work.

## 2. Scope

Designed as a centralized repository, this platform ensures accessibility and fosters a culture of innovation. The project will be a web-based application that serves as a centralized repository for all projects created by students in our college. It will provide functionalities for uploading, sharing, rating, and viewing projects. The system will be accessible to all students and faculty members, promoting a culture of innovation and knowledge sharing.

## 3. Functional Requirement

### 3.1 User Registration and Authentication

- The system shall allow users to register using their college email.  
- The system shall authenticate users via a secure login mechanism.

### 3.2 Project Upload

- The system shall allow authenticated users to upload projects.  
- The system shall allow users to provide project details like title, description, tags, GitHub repository.  
- The system shall generate a unique URL for each project.

### 3.3 Project Rating

- The system shall allow authenticated users to rate projects on a scale of 1 to 5 stars.  
- The system shall calculate and display the average rating for each project.

### 3.4 Project Viewing

- The system shall display projects in a list or grid view.  
- The system shall sort projects by rating, with higher-rated projects displayed first.

### 3.5 Search and filter

- The system shall provide a search bar for users to search for projects by keywords.  
- The system shall allow users to filter projects by tags.

### 3.6 Admin Panel

- The system shall provide an admin panel for managing users, projects, and ratings.  
- The system shall allow administrators to remove inappropriate content.

### 3.7 Bug Bounty

- The system shall allow users to report bugs with details such as description, severity, and steps to reproduce.  
- The system shall award points to users based on the severity of the bug reported.  
- The system shall maintain a leaderboard showcasing top bug hunters.  
- The system shall allow administrators to validate and categorize reported bugs.

## 4. Non-functional Requirement

### 4.1 Performance

The system should be able to handle a large number of requests at any given time without any lag or delay.

### 4.2 Security

The system should be secured with proper authentication and authorization mechanisms to ensure that user data is safe and protected.

### 4.3 User Interface

The system should have a user-friendly interface that enables users to interact with it at ease.

## 5. Software Requirements

- **Frontend** : React.js  
- **Backend** : Node.js with MongoDB  
- **Hosting** : Cloudflare

## 6. Data Model

- **User Data** : Name, email, user role.  
- **Project Data** : Project ID, title, description, category, ratings, comments.  
- **Comment and Rating Data** : User ID, project ID, rating score. comment text.

## 7. Assumptions and Constraints

### 7.1 Assumptions

- Users have access to a stable internet connection.  
- Users actively engage in providing feedback.

### 7.2 Constraints

- The platform requires proper moderation to maintain quality content.

## 8. Dependencies

- Requires database connectivity for storing project data.  
- Hosting services for deployment.

## 9. Acceptance Criteria

- Users must be able to successfully register and log in.  
- Project uploads should be functional and categorized correctly.  
- Rating and commenting should work without delays.  
- Admins should have control over moderation features.
