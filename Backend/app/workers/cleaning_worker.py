import time

from app.workers.celery_app import celery_app


@celery_app.task(bind=True)
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