import time

from app.workers.celery_app import celery_app


@celery_app.task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def process_dataset(self, dataset_id: int):
    self.update_state(
        state="PROGRESS",
        meta={
            "progress": 10,
            "message": "Starting dataset processing",
        },
    )

    time.sleep(2)

    self.update_state(
        state="PROGRESS",
        meta={
            "progress": 50,
            "message": "Processing dataset",
        },
    )

    time.sleep(2)

    self.update_state(
        state="PROGRESS",
        meta={
            "progress": 90,
            "message": "Finishing dataset processing",
        },
    )

    time.sleep(2)

    return {
        "dataset_id": dataset_id,
        "status": "completed",
    }


@celery_app.task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def test_retry_task(self):
    print("TEST RETRY TASK EXECUTED")
    raise Exception("Intentional test failure")