import os
import uuid
import logging
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.db.session import get_dynamic_db_engine
from app.schemas.datasets import DatabaseConnection, DatasetCreate
from app.core.config import settings
from app.utils.file_processing import save_upload_file, parse_data_file
from app.utils.encryption import encrypt_password
from app.core.exceptions import DatasetNotFoundException

logger = logging.getLogger(__name__)

class DatasetService:
    def __init__(self, db: Session):
        self.db = db
        self.upload_dir = settings.UPLOAD_DIR
        
    async def handle_file_upload(self, file: UploadFile) -> DatasetCreate:
        """处理文件上传全流程"""
        # 保存文件
        file_path = await save_upload_file(file, self.upload_dir)
        
        # 解析文件
        parsed_data = await parse_data_file(file_path)
        
        # 创建数据集记录
        dataset_id = str(uuid.uuid4())
        return DatasetCreate(
            id=dataset_id,
            name=file.filename,
            file_type=file.content_type,
            created_at=parsed_data["created_at"],
            columns=parsed_data["columns"],
            preview_url=f"/api/v1/datasets/{dataset_id}/preview"
        )

    async def test_database_connection(self, conn_info: DatabaseConnection) -> dict:
        """测试数据库连接"""
        # 加密密码
        encrypted_password = encrypt_password(conn_info.password)
        
        # 创建动态引擎
        engine = get_dynamic_db_engine(
            db_type=conn_info.db_type,
            host=conn_info.host,
            port=conn_info.port,
            database=conn_info.database,
            user=conn_info.username,
            password=encrypted_password,
            ssl=conn_info.ssl
        )
        
        # 测试连接
        try:
            with engine.connect() as conn:
                conn.execute("SELECT 1")
            return {"status": "success", "connection_id": str(uuid.uuid4())}
        except Exception as e:
            logger.error(f"Database connection failed: {str(e)}")
            raise DatabaseConnectionException(detail=f"Connection failed: {str(e)}")

    async def get_preview_data(self, dataset_id: str) -> dict:
        """获取数据集预览数据"""
        try:
            # 获取数据集元数据
            dataset = self.db.query(Dataset).filter(Dataset.id == dataset_id).first()
            if not dataset:
                raise DatasetNotFoundException(detail=f"Dataset {dataset_id} not found")
            
            # 根据文件类型获取数据
            if dataset.file_type == "text/csv":
                data = await self._get_csv_preview(dataset.file_path)
            elif dataset.file_type == "application/json":
                data = await self._get_json_preview(dataset.file_path)
            else:
                raise ValueError(f"Unsupported file type: {dataset.file_type}")
            
            return {
                "columns": data["columns"],
                "sample_rows": data["rows"][:10],  # 返回前10行作为预览
                "total_count": data["total_count"]
            }
        except Exception as e:
            logger.error(f"Failed to get preview data for dataset {dataset_id}: {str(e)}")
            raise

    async def _get_csv_preview(self, file_path: str) -> dict:
        """获取CSV文件预览数据"""
        import pandas as pd
        try:
            df = pd.read_csv(file_path)
            return {
                "columns": df.columns.tolist(),
                "rows": df.head(100).to_dict(orient="records"),
                "total_count": len(df)
            }
        except Exception as e:
            raise ValueError(f"Failed to read CSV file: {str(e)}")

    async def _get_json_preview(self, file_path: str) -> dict:
        """获取JSON文件预览数据"""
        import json
        try:
            with open(file_path, "r") as f:
                data = json.load(f)
            
            if isinstance(data, list):
                return {
                    "columns": list(data[0].keys()) if data else [],
                    "rows": data[:100],
                    "total_count": len(data)
                }
            else:
                raise ValueError("JSON data must be an array of objects")
        except Exception as e:
            raise ValueError(f"Failed to read JSON file: {str(e)}")