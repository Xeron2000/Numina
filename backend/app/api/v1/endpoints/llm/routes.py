from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import Response
from datetime import datetime, timedelta
import openai
import json
import httpx

from app.core.deps import get_current_active_user
from app.db.session import get_db
from app.models.settings import UserSettings as UserSettingsModel
from app.models.user import User
from app.models.llm_report import LLMReport as LLMReportModel
from app.schemas.settings import (
    ChatRequest,
    LLMConfig,
    ModelListRequest,
    LLMReportCreate,
    LLMReportResponse,
)

router = APIRouter()


def get_llm_config(settings: UserSettingsModel):
    if not settings.llm_config:
        raise HTTPException(status_code=400, detail="LLM not configured")
    return settings.llm_config


@router.get("/models")
async def get_models(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)
):
    settings = (
        db.query(UserSettingsModel)
        .filter(UserSettingsModel.user_id == current_user.id)
        .first()
    )
    if (
        not settings
        or not settings.llm_config
        or not settings.llm_config.get("api_key")
    ):
        raise HTTPException(status_code=400, detail="LLM configuration not found")

    config = settings.llm_config
    client = openai.OpenAI(
        api_key=config.get("api_key"),
        base_url=config.get("base_url", "https://api.openai.com/v1"),
    )

    try:
        models = client.models.list()
        return {
            "code": 200,
            "message": "success",
            "data": [model.id for model in models.data],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/models")
async def get_models_with_config(
    request: ModelListRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    import traceback
    import httpx

    try:
        print(f"DEBUG: Attempting to fetch models from {request.base_url}")

        # 先用 httpx 测试连接，查看实际返回内容
        test_url = f"{request.base_url.rstrip('/')}/models"
        print(f"DEBUG: Testing connection to {test_url}")

        async with httpx.AsyncClient(timeout=30.0) as http_client:
            response = await http_client.get(
                test_url, headers={"Authorization": f"Bearer {request.api_key}"}
            )
            print(f"DEBUG: Test response status: {response.status_code}")
            print(
                f"DEBUG: Test response content-type: {response.headers.get('content-type')}"
            )
            print(
                f"DEBUG: Test response body (first 1000 chars): {response.text[:1000]}"
            )

        # 使用 OpenAI 客户端
        client = openai.OpenAI(
            api_key=request.api_key,
            base_url=request.base_url,
            timeout=30.0,
            max_retries=0,
        )

        print(f"DEBUG: Created client successfully")
        models = client.models.list()
        print(f"DEBUG: Got {len(models.data)} models")
        return {
            "code": 200,
            "message": "success",
            "data": [model.id for model in models.data],
        }
    except openai.APIError as e:
        print(f"DEBUG: OpenAI API Error - {type(e).__name__}: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"OpenAI API Error: {str(e)}")
    except Exception as e:
        print(f"DEBUG: General Error - {type(e).__name__}: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Error: {type(e).__name__} - {str(e)}"
        )


@router.post("/chat")
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    settings = (
        db.query(UserSettingsModel)
        .filter(UserSettingsModel.user_id == current_user.id)
        .first()
    )
    if not settings or not settings.llm_config:
        raise HTTPException(
            status_code=400,
            detail="LLM configuration not found. Please configure in settings.",
        )

    config = settings.llm_config

    # 检查是否有缓存的报告（7天内有效）
    seven_days_ago = datetime.now() - timedelta(days=7)
    query = db.query(LLMReportModel).filter(
        LLMReportModel.user_id == current_user.id,
        LLMReportModel.prompt == request.message,
        LLMReportModel.created_at >= seven_days_ago,
    )
    if request.dataset_id is not None:
        query = query.filter(LLMReportModel.dataset_id == request.dataset_id)
    existing_report = query.order_by(LLMReportModel.created_at.desc()).first()

    if existing_report:
        # 返回缓存的报告
        return Response(content=existing_report.response, media_type="text/plain")

    # 调用 LLM API
    client = openai.AsyncOpenAI(
        api_key=config.get("api_key"),
        base_url=config.get("base_url", "https://api.openai.com/v1"),
    )

    full_response = []

    try:
        response = await client.chat.completions.create(
            model=config.get("model", "gpt-3.5-turbo"),
            messages=[{"role": "user", "content": request.message}],
            stream=False,
        )

        # 获取完整响应
        complete_response = response.choices[0].message.content

        # 保存完整报告到数据库
        report = LLMReportModel(
            user_id=current_user.id,
            dataset_id=request.dataset_id,
            prompt=request.message,
            response=complete_response,
            model=config.get("model", "gpt-3.5-turbo"),
        )
        db.add(report)
        db.commit()

        return Response(content=complete_response, media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reports", response_model=dict[str, list[LLMReportResponse]])
async def get_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    reports = (
        db.query(LLMReportModel)
        .filter(LLMReportModel.user_id == current_user.id)
        .order_by(LLMReportModel.created_at.desc())
        .limit(100)
        .all()
    )

    return {
        "code": 200,
        "message": "success",
        "data": [
            {
                "id": report.id,
                "user_id": report.user_id,
                "dataset_id": report.dataset_id,
                "prompt": report.prompt,
                "response": report.response,
                "model": report.model,
                "created_at": report.created_at.isoformat()
                if report.created_at
                else None,
            }
            for report in reports
        ],
    }
