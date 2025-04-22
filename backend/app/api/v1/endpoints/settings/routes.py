from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, Generic, TypeVar

from app.core.deps import get_current_active_user
from app.db.session import get_db
from app.models.settings import UserSettings as UserSettingsModel
from app.models.user import User
from app.schemas.settings import (
    UserSettings as UserSettingsSchema,
    AppearanceSettings,
    DisplaySettings
)

# Define TypeVar for generic type
T = TypeVar('T')

# Update Response model to support generic types
class Response(BaseModel, Generic[T]):
    code: int
    message: str
    data: T

router = APIRouter()

@router.get("/profile", response_model=Response[UserSettingsSchema])
async def get_user_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    settings = db.query(UserSettingsModel).filter(UserSettingsModel.user_id == current_user.id).first()
    if not settings:
        settings = UserSettingsModel(
            user_id=current_user.id,
            theme='light',
            language='zh-CN',
            notifications_enabled=True,
            display_settings={},
            map_settings={}
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return {
        "code": 200,
        "message": "success",
        "data": settings
    }

@router.put("/display", response_model=Response[UserSettingsSchema])
async def update_display_settings(
    display: DisplaySettings,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    try:
        settings = db.query(UserSettingsModel).filter(UserSettingsModel.user_id == current_user.id).first()
        if not settings:
            settings = UserSettingsModel(
                user_id=current_user.id,
                display_settings={},
                map_settings={}
            )
            db.add(settings)
        
        # Convert display settings to dict using dict() instead of model_dump()
        display_dict = display.dict(exclude_unset=True)
        settings.display_settings = display_dict
        db.commit()
        db.refresh(settings)
        
        return {
            "code": 200,
            "message": "success",
            "data": settings
        }
    except Exception as e:
        db.rollback()
        return {
            "code": 500,
            "message": str(e),
            "data": None
        }

@router.put("/appearance", response_model=UserSettingsSchema)
async def update_appearance_settings(
    appearance: AppearanceSettings,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    settings = db.query(UserSettingsModel).filter(UserSettingsModel.user_id == current_user.id).first()
    if not settings:
        settings = UserSettingsModel(
            user_id=current_user.id,
            theme=appearance.theme,
            display_settings={},
            map_settings={}
        )
        db.add(settings)
    else:
        settings.theme = appearance.theme
    
    db.commit()
    db.refresh(settings)
    return settings