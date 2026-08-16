from fastapi import FastAPI

app = FastAPI(
    title="Cleanytics API",
    description="Backend API for the Cleanytics data cleaning platform",
    version="1.0.0",
)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Cleanytics API",
        "status": "running",
    }