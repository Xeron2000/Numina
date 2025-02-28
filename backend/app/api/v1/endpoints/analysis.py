from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import pandas as pd
from sqlalchemy.orm import Session
from app.db.session import get_db
from typing import Any, List
from app.schemas.analysis import CleanRequest, TransformRequest, TrainRequest, AnalysisRequest
from app.services.analysis_service import AnalysisService
from app.services.dataset_service import DatasetService
from app.core.security import get_current_user
from fastapi import status

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_csv(
    file: UploadFile = File(...),
    current_user: Any = Depends(get_current_user)
):
    try:
        # 验证文件大小
        file.file.seek(0, 2)
        file_size = file.file.tell()
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File size exceeds 5MB limit"
            )
        file.file.seek(0)
        
        # 验证文件类型
        if not file.filename.endswith('.csv'):
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Only CSV files are allowed"
            )

        # 调用数据集服务保存数据
        result = await DatasetService.save_upload_file(file, current_user)
        return {"status": "success", "data": result}

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File upload failed: {str(e)}"
        )

@router.get("/data")
async def preview_data(
    current_user: Any = Depends(get_current_user)
) -> List[dict]:
    try:
        # 获取最新100条数据
        data = await DatasetService.get_latest_records(100)
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Data retrieval failed: {str(e)}"
        )

@router.post("/analyze")
async def analyze_trends(
    request: AnalysisRequest,
    current_user: Any = Depends(get_current_user)
):
    try:
        # 执行趋势分析（带时间范围过滤）
        analysis_data = await AnalysisService.analyze_time_series(
            dataset_id=request.dataset_id,
            date_column=request.date_column,
            value_column=request.value_column,
            interval=request.interval,
            start_date=request.start_date,
            end_date=request.end_date
        )
        return {"status": "success", "data": analysis_data}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Analysis failed: {str(e)}"
        )

@router.post("/clean")
async def clean_data(
    request: CleanRequest,
    current_user: Any = Depends(get_current_user)
):
    try:
        result = await AnalysisService.clean_data(request)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/transform")
async def transform_data(
    request: TransformRequest,
    current_user: Any = Depends(get_current_user)
):
    try:
        result = await AnalysisService.transform_data(request)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/train")
async def train_model(
    request: TrainRequest,
    current_user: Any = Depends(get_current_user)
):
    try:
        result = await AnalysisService.train_model(request)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{dataset_id}")
async def get_analysis(
    dataset_id: int,
    current_user: Any = Depends(get_current_user)
):
    try:
        # 获取数据集并执行分析
        dataset = await DatasetService.get_dataset(dataset_id)
        df = pd.read_parquet(dataset.path)
        
        # 执行基础分析
        analysis_result = {
            "dataset_id": dataset_id,
            "row_count": len(df),
            "columns": list(df.columns),
            "summary_stats": df.describe().to_dict()
        }
        
        return {"status": "success", "data": analysis_result}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )

@router.get("/health")
async def health_check(
    db: Session = Depends(get_db)
):
    """健康检查接口
    
    - 返回服务状态信息
    - 检查数据库连接
    - 返回关键依赖项版本
    """
    try:
        # 测试数据库连接
        db.execute("SELECT 1")
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "database": "connected",
            "dependencies": {
                "fastapi": "0.95.2",
                "sqlalchemy": "2.0.15",
                "pandas": "1.5.3"
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service unavailable: {str(e)}"
        )

@router.get("/templates")
async def get_templates(
    current_user: Any = Depends(get_current_user)
):
    try:
        # 获取预定义的分析模板
        templates = [
            {
                "id": 1,
                "name": "销售趋势分析",
                "description": "分析产品销售趋势",
                "parameters": ["date", "sales"]
            },
            {
                "id": 2,
                "name": "用户行为分析",
                "description": "分析用户行为模式",
                "parameters": ["user_id", "action", "timestamp"]
            }
        ]
        return {"status": "success", "data": templates}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get templates: {str(e)}"
        )