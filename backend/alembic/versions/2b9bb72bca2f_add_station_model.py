"""Add station model

Revision ID: 2b9bb72bca2f
Revises: 9bc0dcff025b
Create Date: 2024-01-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '2b9bb72bca2f'
down_revision = '9bc0dcff025b'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create stations table
    op.create_table(
        'stations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('code', sa.String(), nullable=False),
        sa.Column('province', sa.String(), nullable=False),
        sa.Column('city', sa.String(), nullable=False),
        sa.Column('district', sa.String(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('elevation', sa.Float(), nullable=True),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=False, server_default='active'),
        sa.Column('station_metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_stations_id'), 'stations', ['id'], unique=False)
    op.create_index(op.f('ix_stations_code'), 'stations', ['code'], unique=True)

def downgrade() -> None:
    op.drop_index(op.f('ix_stations_code'), table_name='stations')
    op.drop_index(op.f('ix_stations_id'), table_name='stations')
    op.drop_table('stations')
