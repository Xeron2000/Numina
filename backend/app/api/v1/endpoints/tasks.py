from fastapi import APIRouter, status
from typing import List

router = APIRouter()

@router.get("/tasks", status_code=status.HTTP_200_OK)
async def get_tasks():
    return {"message": "Task status API"}