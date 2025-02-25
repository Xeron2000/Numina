from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.services.dataset_service import DatasetService
from app.schemas.datasets import DatabaseConnection, DatasetCreate
from app.db.session import get_db
from app.core.exceptions import DatabaseConnectionException

router = APIRouter()

@router.post("/upload", response_model=DatasetCreate)
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    service = DatasetService(db)
    return await service.handle_file_upload(file)

@router.post("/connect")
async def connect_database(
    conn_info: DatabaseConnection,
    db: Session = Depends(get_db)
):
    service = DatasetService(db)
    try:
        return await service.test_database_connection(conn_info)
    except DatabaseConnectionException as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{dataset_id}/preview")
async def preview_dataset(
    dataset_id: str,
    db: Session = Depends(get_db)
):
    service = DatasetService(db)
    return await service.get_preview_data(dataset_id)