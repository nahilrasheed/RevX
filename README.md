# REV-X: A Collaborative Project Sharing Platform

## Introduction
REV-X is a web-based platform that allows users to upload completed projects, receive ratings and feedback, and explore peer submissions. It is designed to encourage constructive feedback, enhance project quality, and promote collaborative work among students.

## Features
- **User Registration & Authentication**: Secure login system using college email.
- **Project Upload**: Upload projects with title, description, tags, and GitHub repository link.
- **Project Rating**: Rate projects on a 1-5 star scale with average ratings displayed.
- **Project Viewing**: Browse projects in list or grid view, sorted by rating.
- **Search & Filter**: Find projects easily using keyword search and category filters.
- **Admin Panel**: Manage users, projects, and ratings; remove inappropriate content.
- **Bug Bounty System**: Report bugs, earn points, and compete on a leaderboard.

## Tech Stack
### Frontend
- React.js
- JavaScript
- HTML & CSS

### Backend
- Node.js
- MySQL/MongoDB

### Hosting
- Cloudflare

## Data Model
- **User Data**: Name, email, user role (student/faculty/admin)
- **Project Data**: Project ID, title, description, category, ratings, comments
- **Comment & Rating Data**: User ID, project ID, rating score, comment text

## Installation & Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/rev-x.git
   cd rev-x
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables** (e.g., database URL, authentication keys).
4. **Run the backend**:
   ```bash
   npm start
   ```
5. **Run the frontend**:
   ```bash
   cd client
   npm start
   ```
6. **Access the platform** via `http://localhost:3000`

## Future Enhancements
- Gamification with badges for top-rated projects.
- Advanced analytics for project engagement.
- AI-powered feedback system.
