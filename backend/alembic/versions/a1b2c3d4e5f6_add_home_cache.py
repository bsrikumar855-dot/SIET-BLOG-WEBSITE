"""Add home_cache table

Revision ID: a1b2c3d4e5f6
Revises: 7167703dce38
Create Date: 2026-07-17 09:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '7167703dce38'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add home_cache table for materialized dashboard/analytics data."""
    op.create_table(
        'home_cache',
        sa.Column('key', sa.String(length=255), primary_key=True, nullable=False),
        sa.Column('value', sa.Text(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
    )


def downgrade() -> None:
    """Drop home_cache table."""
    op.drop_table('home_cache')
