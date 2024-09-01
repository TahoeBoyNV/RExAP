from flask import render_template, redirect, url_for, request, flash
from app import app, db, mail
from models import Offer, Inspection
from forms import OfferForm
from flask_mail import Message
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os

@app.route('/', methods=['GET', 'POST'])
def intake_form():
    try:
        form = OfferForm()
        if form.validate_on_submit():
            new_offer = Offer(
                full_name=form.full_name.data,
                second_person=form.second_person.data,
                second_person_name=form.second_person_name.data,
                purchase_price=form.purchase_price.data,
                property_address=form.property_address.data,
                primary_residence=form.primary_residence.data == 'yes',
                offer_type=form.offer_type.data,
                days_until_cash_available=form.days_until_cash_available.data,
                financing_type=form.financing_type.data,
                max_interest_rate=form.max_interest_rate.data,
                downpayment=form.downpayment.data,
                amount_financed=form.amount_financed.data,
                days_to_submit_financing_app=form.days_to_submit_financing_app.data,
                emd_method=form.emd_method.data,
                emd_other=form.emd_other.data,
                emd_value=form.emd_value.data,
                emd_days=form.emd_days.data,
                appraisal_contingency=form.appraisal_contingency.data == 'yes',
                appraisal_contingency_days=form.appraisal_contingency_days.data,
                financing_contingency=form.financing_contingency.data == 'yes',
                financing_contingency_days=form.financing_contingency_days.data,
                inspection_contingency=form.inspection_contingency.data == 'yes',
                inspection_contingency_days=form.inspection_contingency_days.data
            )
            db.session.add(new_offer)
            
            if form.inspection_contingency.data == 'yes':
                for inspection_form in form.inspections:
                    new_inspection = Inspection(
                        offer=new_offer,
                        type=inspection_form.form.type.data,
                        paid_by=inspection_form.form.paid_by.data
                    )
                    db.session.add(new_inspection)
            
            db.session.commit()
            
            flash('Your offer has been submitted successfully!', 'success')
            return redirect(url_for('review', offer_id=new_offer.id))
        return render_template('intake_form.html', form=form)
    except Exception as e:
        app.logger.error(f"Error in intake_form: {str(e)}")
        return f"An error occurred: {str(e)}", 500

@app.route('/review/<int:offer_id>', methods=['GET', 'POST'])
def review(offer_id):
    try:
        offer = Offer.query.get_or_404(offer_id)
        if request.method == 'POST':
            pdf_file = generate_pdf(offer)
            send_email(offer.full_name, pdf_file)
            return redirect(url_for('payment', offer_id=offer.id))
        return render_template('review.html', offer=offer)
    except Exception as e:
        app.logger.error(f"Error in review: {str(e)}")
        return f"An error occurred: {str(e)}", 500

@app.route('/payment/<int:offer_id>', methods=['GET', 'POST'])
def payment(offer_id):
    try:
        offer = Offer.query.get_or_404(offer_id)
        if request.method == 'POST':
            # Handle Stripe payment
            # Update offer status after successful payment
            flash('Payment successful!', 'success')
            return redirect(url_for('confirmation', offer_id=offer.id))
        return render_template('payment.html', offer=offer)
    except Exception as e:
        app.logger.error(f"Error in payment: {str(e)}")
        return f"An error occurred: {str(e)}", 500

@app.route('/confirmation/<int:offer_id>')
def confirmation(offer_id):
    try:
        offer = Offer.query.get_or_404(offer_id)
        return render_template('confirmation.html', offer=offer)
    except Exception as e:
        app.logger.error(f"Error in confirmation: {str(e)}")
        return f"An error occurred: {str(e)}", 500

def generate_pdf(offer):
    pdf_file = f"offer_{offer.id}.pdf"
    c = canvas.Canvas(pdf_file, pagesize=letter)
    c.drawString(100, 750, f"Offer for: {offer.property_address}")
    c.drawString(100, 730, f"Buyer: {offer.full_name}")
    c.drawString(100, 710, f"Purchase Price: ${offer.purchase_price:,.2f}")
    # Add more offer details...
    c.save()
    return pdf_file

def send_email(to_name, pdf_file):
    try:
        msg = Message('Your Real Estate Offer', 
                      sender=app.config['MAIL_USERNAME'],
                      recipients=[to_name])  # Assuming full_name is an email address for simplicity
        msg.body = 'Please find attached the PDF of your real estate offer.'
        with app.open_resource(pdf_file) as fp:
            msg.attach(pdf_file, 'application/pdf', fp.read())
        mail.send(msg)
    except Exception as e:
        app.logger.error(f"Error sending email: {str(e)}")
        raise

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('500.html'), 500