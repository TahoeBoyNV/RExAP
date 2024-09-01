"""Initial migration

Revision ID: afc234f77b0a
Revises: 
Create Date: 2024-08-25 23:45:50.642817

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'afc234f77b0a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('offer',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('full_name', sa.String(length=100), nullable=False),
    sa.Column('second_person', sa.Boolean(), nullable=True),
    sa.Column('second_person_name', sa.String(length=100), nullable=True),
    sa.Column('purchase_price', sa.Float(), nullable=False),
    sa.Column('property_address', sa.String(length=200), nullable=False),
    sa.Column('primary_residence', sa.Boolean(), nullable=False),
    sa.Column('offer_type', sa.String(length=20), nullable=False),
    sa.Column('days_until_cash_available', sa.Integer(), nullable=True),
    sa.Column('financing_type', sa.String(length=50), nullable=True),
    sa.Column('max_interest_rate', sa.Float(), nullable=True),
    sa.Column('downpayment', sa.Float(), nullable=True),
    sa.Column('amount_financed', sa.Float(), nullable=True),
    sa.Column('days_to_submit_financing_app', sa.Integer(), nullable=True),
    sa.Column('emd_method', sa.String(length=50), nullable=False),
    sa.Column('emd_other', sa.String(length=100), nullable=True),
    sa.Column('emd_value', sa.Float(), nullable=False),
    sa.Column('emd_days', sa.Integer(), nullable=False),
    sa.Column('appraisal_contingency', sa.Boolean(), nullable=False),
    sa.Column('appraisal_contingency_days', sa.Integer(), nullable=True),
    sa.Column('financing_contingency', sa.Boolean(), nullable=False),
    sa.Column('financing_contingency_days', sa.Integer(), nullable=True),
    sa.Column('inspection_contingency', sa.Boolean(), nullable=False),
    sa.Column('inspection_contingency_days', sa.Integer(), nullable=True),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('inspection',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('offer_id', sa.Integer(), nullable=False),
    sa.Column('type', sa.String(length=100), nullable=False),
    sa.Column('paid_by', sa.String(length=20), nullable=False),
    sa.ForeignKeyConstraint(['offer_id'], ['offer.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('inspection')
    op.drop_table('offer')
    # ### end Alembic commands ###
