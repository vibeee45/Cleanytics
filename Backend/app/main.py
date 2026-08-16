from fastapi import FastAPI

from app.api.v1.health import router as health_router


app = FastAPI(
    title="Cleanytics API",
    description="Backend API for the Cleanytics data cleaning platform",
    version="1.0.0",
)


app.include_router(
    health_router,
    prefix="/api/v1",
)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Cleanytics API",
        "status": "running",
    }