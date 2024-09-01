from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, BooleanField, SelectField, RadioField, SubmitField, IntegerField, FieldList, FormField
from wtforms.validators import DataRequired, Optional, NumberRange

class InspectionField(FlaskForm):
    type = StringField('Inspection Type')
    paid_by = SelectField('Paid By', choices=[('waived', 'Waived'), ('buyer', 'Buyer'), ('seller', 'Seller')])

class OfferForm(FlaskForm):
    full_name = StringField('Enter your full name', validators=[DataRequired()])
    second_person = BooleanField('Are you submitting this offer with a second person?')
    second_person_name = StringField('Enter the second person\'s name', validators=[Optional()])
    purchase_price = StringField('Purchase Price', validators=[DataRequired()], render_kw={"type": "text", "inputmode": "numeric", "pattern": "[0-9]*"})
    property_address = StringField('Address', validators=[DataRequired()])
    
    primary_residence = RadioField('Will this be your primary residence?', 
                                   choices=[('yes', 'Yes'), ('no', 'No')],
                                   validators=[DataRequired()])

    offer_type = RadioField('Offer Type', 
                            choices=[('cash', 'Cash Offer'), ('financing', 'Financing')],
                            validators=[DataRequired()])
    
    # Cash offer fields
    days_until_cash_available = IntegerField('Days until cash is available', validators=[Optional()])
    
    # Financing fields
    financing_type = SelectField('Type of Financing', 
                                 choices=[('conventional', 'Conventional'), 
                                          ('fha', 'FHA'), 
                                          ('va', 'VA'), 
                                          ('rural', 'Rural'), 
                                          ('private', 'Private')], 
                                 validators=[Optional()])
    max_interest_rate = DecimalField('Max Interest Rate Approved For', validators=[Optional()])
    downpayment = DecimalField('Down Payment Amount ($)', validators=[Optional()])
    amount_financed = DecimalField('Amount Financed', render_kw={'readonly': True})
    days_to_submit_financing_app = IntegerField('Days to submit financing application', validators=[Optional()])

    emd_method = SelectField('How do you plan to send the earnest money deposit?', 
                             choices=[('check', 'Check'), ('wire_transfer', 'Wire Transfer'), ('other', 'Other')], 
                             validators=[DataRequired()])
    emd_other = StringField('Please specify', validators=[Optional()])
    emd_value = DecimalField('Earnest Money Deposit Value', validators=[Optional()])
    emd_days = IntegerField('Days to submit EMD', validators=[DataRequired()])

    appraisal_contingency = RadioField('Do you want an appraisal contingency?', 
                                       choices=[('yes', 'Yes'), ('no', 'No')],
                                       validators=[DataRequired()])
    appraisal_contingency_days = IntegerField('Appraisal contingency days', validators=[Optional()])

    financing_contingency = RadioField('Do you want a financing contingency?', 
                                       choices=[('yes', 'Yes'), ('no', 'No')],
                                       validators=[DataRequired()])
    financing_contingency_days = IntegerField('Financing contingency days', validators=[Optional()])

    inspection_contingency = RadioField('Do you want an inspection contingency?', 
                                        choices=[('yes', 'Yes'), ('no', 'No')],
                                        validators=[DataRequired()])
    inspection_contingency_days = IntegerField('Inspection contingency days', validators=[Optional()])
    
    inspections = FieldList(FormField(InspectionField), min_entries=5)

    submit = SubmitField('Submit Offer')

    def __init__(self, *args, **kwargs):
        super(OfferForm, self).__init__(*args, **kwargs)
        inspection_types = ['Home Inspection', 'Roof Inspection', 'HVAC Inspection', 'Plumbing Inspection', 'Electrical Inspection']
        for i, inspection_type in enumerate(inspection_types):
            if len(self.inspections) > i:
                self.inspections[i].form.type.data = inspection_type