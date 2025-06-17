from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, project, user, admin, imagekit
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="RevX API")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    frontend_url
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix='/auth', tags=['Authentication'])
app.include_router(project.router, prefix='/project', tags=['Project'])
app.include_router(user.router, prefix='/user', tags=['User'])
app.include_router(imagekit.router, prefix='/api/imagekit', tags=['ImageKit'])
app.include_router(admin.router, prefix='/admin', tags=['Admin'])


@app.get("/")
async def root():
    return {"message": "Welcome to RevX API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "RevX API"}