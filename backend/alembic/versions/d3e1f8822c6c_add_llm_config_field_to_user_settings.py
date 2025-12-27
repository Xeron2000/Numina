"""add llm_config field to user settings

Revision ID: d3e1f8822c6c
Revises: c4e1b7712b5b
Create Date: 2024-12-27

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d3e1f8822c6c"
down_revision: Union[str, None] = "c4e1b7712b5b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("user_settings", schema=None) as batch_op:
        batch_op.add_column(sa.Column("llm_config", sa.JSON(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table("user_settings", schema=None) as batch_op:
        batch_op.drop_column("llm_config")
