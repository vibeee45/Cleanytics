from fastapi import APIRouter

from app.workers.celery_app import celery_app


router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/{task_id}")
async def get_job_status(task_id: str):
    result = celery_app.AsyncResult(task_id)

    response = {
        "task_id": task_id,
        "status": result.status,
        "progress": 0,
        "message": None,
        "result": None,
    }

    if result.status == "PROGRESS":
        if isinstance(result.info, dict):
            response["progress"] = result.info.get("progress", 0)
            response["message"] = result.info.get("message")

    elif result.status == "SUCCESS":
        response["progress"] = 100
        response["message"] = "Dataset processing completed"
        response["result"] = result.result

    elif result.status == "FAILURE":
        response["message"] = str(result.result)

    return response