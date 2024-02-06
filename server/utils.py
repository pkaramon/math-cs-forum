# utils.py
import random
import smtplib
import string
from datetime import timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from argon2 import PasswordHasher
from flask import jsonify
from flask_jwt_extended import exceptions, JWTManager, create_access_token

jwt_manager = JWTManager()
ph = PasswordHasher()

SECRET_KEY = 'your_secret_key_here'


def generate_token(user_id, role):
    additional_claims = {"role": role, "user_id": user_id}

    return create_access_token(identity=user_id, expires_delta=timedelta(minutes=30),
                               additional_claims=additional_claims)


def verify_password(hashed_password, password):
    return ph.verify(hashed_password, password)


def generate_random_password(length=10):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for _ in range(length))


def send_email(receiver_email, message):
    try:
        msg = MIMEMultipart()
        msg['From'] = 'wdaisupersite@gmail.com'
        msg['To'] = receiver_email
        msg['Subject'] = 'Password Reset'

        msg.attach(MIMEText(message, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login('wdaisupersite@gmail.com', 'klei teqb xgqw rwyz')
        text = msg.as_string()
        server.sendmail('wdaisupersite@gmail.com', receiver_email, text)
        server.quit()
        return True, None
    except Exception as e:
        return False, str(e)


def handle_missing_authorization_header(error):
    return jsonify({
        'message': 'Missing Authorization Header',
        'error': 'Authorization header is required to access this resource.'
    }), 401


def register_error_handlers(app):
    app.errorhandler(exceptions.NoAuthorizationError)(handle_missing_authorization_header)


def generate_reset_token(email, user_id):
    additional_claims = {"email": email}
    return create_access_token(identity=user_id, expires_delta=timedelta(minutes=5),
                               additional_claims=additional_claims)
