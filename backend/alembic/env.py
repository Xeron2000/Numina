from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Import Base and all models for Alembic to detect
from app.db.base_class import Base
from app.models.user import User
from app.models.dataset import Dataset
from app.models.query import SavedQuery
from app.models.visualization import Visualization
from app.models.settings import UserSettings
from app.models.geospatial import GeoFence
from app.models.analytics import AnalyticsTask
from app.models.station import Station
from app.models.activity import Activity  # Add this if you have activity model

# this is the Alembic Config object
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 设置数据库 URL
config.set_main_option("sqlalchemy.url", "sqlite:///./sql_app.db")

# 设置 target_metadata
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_as_batch=True,  # Enable batch mode for SQLite
            compare_type=True,     # Compare column types
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
