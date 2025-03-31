from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, project, user

app = FastAPI(title="RevX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix='/auth', tags=['Authentication'])
app.include_router(project.router, prefix='/project', tags=['Project'])
app.include_router(project.router, prefix='/user', tags=['User'])

@app.get("/")
async def root():
    return {"message": "Welcome to RevX API"}