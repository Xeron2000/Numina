from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_active_user
from app.db.session import get_db
from app.models.settings import UserSettings
from app.models.user import User
from app.schemas.settings import (
    UserSettingsUpdate, UserSettingsResponse,
    AppearanceSettings, DisplaySettings
)

router = APIRouter()

@router.get("/profile", response_model=UserSettingsResponse)
async def get_user_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/appearance", response_model=UserSettingsResponse)
async def update_appearance_settings(
    appearance: AppearanceSettings,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
    
    settings.theme = appearance.theme
    db.commit()
    db.refresh(settings)
    return settings

@router.put("/display", response_model=UserSettingsResponse)
async def update_display_settings(
    display: DisplaySettings,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)
    
    settings.display_settings = display.dict()
    db.commit()
    db.refresh(settings)
    return settings