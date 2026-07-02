from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.routers import (
    public, dashboard, auth, projects, issues, pull_requests,
    users, leaderboard, badges, announcements
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router, prefix=f"{settings.API_V1_STR}", tags=["public"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["dashboard"])
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}")
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}")
app.include_router(issues.router, prefix=f"{settings.API_V1_STR}")
app.include_router(pull_requests.router, prefix=f"{settings.API_V1_STR}")
app.include_router(users.router, prefix=f"{settings.API_V1_STR}")
app.include_router(leaderboard.router, prefix=f"{settings.API_V1_STR}")
app.include_router(badges.router, prefix=f"{settings.API_V1_STR}")
app.include_router(announcements.router, prefix=f"{settings.API_V1_STR}")

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "FastAPI is running properly."}
