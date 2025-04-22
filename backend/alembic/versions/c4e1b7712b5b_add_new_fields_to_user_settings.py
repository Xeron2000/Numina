"""add new fields to user settings

Revision ID: c4e1b7712b5b
Revises: e6e06b9a48b0
Create Date: 2024-01-xx xx:xx:xx.xxx

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c4e1b7712b5b'
down_revision: Union[str, None] = 'e6e06b9a48b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('user_settings', schema=None) as batch_op:
        batch_op.add_column(sa.Column('font', sa.String(), nullable=False, server_default='default'))
        batch_op.add_column(sa.Column('name', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('dob', sa.String(), nullable=True))

def downgrade() -> None:
    with op.batch_alter_table('user_settings', schema=None) as batch_op:
        batch_op.drop_column('dob')
        batch_op.drop_column('name')
        batch_op.drop_column('font')
