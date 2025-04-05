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
2. **Setup backend**:
    ```bash
    cd backend
    # Create and activate a virtual environment (recommended)
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt

    # Create a .env file in the 'backend' directory with your Supabase credentials:
    # SUPABASE_URL="YOUR_SUPABASE_URL"
    # SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"
    # FRONTEND_URL=''
    # RESET_PASSWORD_URL=''
    # IMAGEKIT_PRIVATE_KEY=''

    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
    > The backend should now be running at `http://localhost:8000`.

3.  **Setup Frontend**:
    ````bash
    cd frontend
    npm install

    # Create a .env file in the 'frontend' directory:
    # VITE_API_URL="http://localhost:8000" # Or your backend URL if different
    # VITE_IMAGEKIT_PUBLIC_KEY=
    # VITE_IMAGEKIT_URL_ENDPOINT=

    npm run dev
    ````
    > The frontend development server should now be running at `http://localhost:5173`.

