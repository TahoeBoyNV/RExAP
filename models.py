from extensions import db
from datetime import datetime

class Inspection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    offer_id = db.Column(db.Integer, db.ForeignKey('offer.id'), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    paid_by = db.Column(db.String(20), nullable=False)

class Offer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    second_person = db.Column(db.Boolean, default=False)
    second_person_name = db.Column(db.String(100))
    purchase_price = db.Column(db.Float, nullable=False)
    property_address = db.Column(db.String(200), nullable=False)
    primary_residence = db.Column(db.Boolean, nullable=False)
    offer_type = db.Column(db.String(20), nullable=False)
    days_until_cash_available = db.Column(db.Integer)
    financing_type = db.Column(db.String(50))
    max_interest_rate = db.Column(db.Float)
    downpayment = db.Column(db.Float)
    amount_financed = db.Column(db.Float)
    days_to_submit_financing_app = db.Column(db.Integer)
    emd_method = db.Column(db.String(50), nullable=False)
    emd_other = db.Column(db.String(100))
    emd_value = db.Column(db.Float, nullable=False)
    emd_days = db.Column(db.Integer, nullable=False)
    appraisal_contingency = db.Column(db.Boolean, nullable=False)
    appraisal_contingency_days = db.Column(db.Integer)
    financing_contingency = db.Column(db.Boolean, nullable=False)
    financing_contingency_days = db.Column(db.Integer)
    inspection_contingency = db.Column(db.Boolean, nullable=False)
    inspection_contingency_days = db.Column(db.Integer)
    inspections = db.relationship('Inspection', backref='offer', lazy=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"Offer('{self.full_name}', '{self.property_address}', ${self.purchase_price})"