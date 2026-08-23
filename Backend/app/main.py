from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.jobs import router as jobs_router
from app.api.v1.auth import router as auth_router
from app.api.v1.health import router as health_router
from app.api.v1.users import router as users_router
from app.api.v1.datasets import router as datasets_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.audit import router as audit_router

app = FastAPI(
    title="Cleanytics API",
    description="Backend API for the Cleanytics data cleaning platform",
    version="1.0.0",
)

# CORS middleware setup for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(datasets_router, prefix="/api/v1")
app.include_router(jobs_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")
app.include_router(audit_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Welcome to Cleanytics API",
        "status": "running",
    }