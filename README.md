# REV-X

## Introduction
REV-X is a web-based platform that allows users to upload completed projects, receive ratings and feedback, and explore peer submissions. It is designed to encourage constructive feedback, enhance project quality, and promote collaborative work among students.

## Features
- **User Registration & Authentication**: Secure login system using college email.
- **Project Upload**: Upload projects with title, description, tags, and GitHub repository link.
- **Project Rating**: Rate projects on a 1-5 star scale with average ratings displayed.
- **Project Viewing**: Browse projects in list or grid view, sorted by rating.
- **Search & Filter**: Find projects easily using keyword search and category filters.

## Tech Stack
### Frontend
- React.js
- Vite

### Backend
- FastAPI

### Databse
- Supabase

## Installation & Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Kandarp05/RevX
   cd RevX
   ```
2. Setup backend
   ```bash
   cd backend
   source /venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
> Your backend is up at *0.0.0.0:8000*

3. Setup frontend
   ```
   cd frontend
   npm i
   npm run dev
   ```
> Your frontend is up at *http://localhost:5173*

