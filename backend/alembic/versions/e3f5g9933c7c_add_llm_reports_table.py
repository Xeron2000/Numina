"""add llm_reports table

Revision ID: e3f5g9933c7c
Revises: d3e1f8822c6c
Create Date: 2024-12-27

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e3f5g9933c7c"
down_revision: Union[str, None] = "d3e1f8822c6c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "llm_reports",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("dataset_id", sa.Integer(), nullable=True),
        sa.Column("prompt", sa.Text(), nullable=False),
        sa.Column("response", sa.Text(), nullable=False),
        sa.Column("model", sa.String(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_llm_reports_user_id"), "llm_reports", ["user_id"], unique=False
    )
    op.create_index(
        op.f("ix_llm_reports_dataset_id"), "llm_reports", ["dataset_id"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_llm_reports_dataset_id"), table_name="llm_reports")
    op.drop_index(op.f("ix_llm_reports_user_id"), table_name="llm_reports")
    op.drop_table("llm_reports")
