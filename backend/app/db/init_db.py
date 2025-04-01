import logging
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import engine
from app.models.user import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(db: Session) -> None:
    # 创建所有表
    Base.metadata.create_all(bind=engine)
    
    # 创建初始超级用户
    user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER).first()
    if not user:
        user_in = User(
            email=settings.FIRST_SUPERUSER,
            username="admin",
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            is_active=True
        )
        db.add(user_in)
        db.commit()
        logger.info("Initial superuser created")
    else:
        logger.info("Superuser already exists")