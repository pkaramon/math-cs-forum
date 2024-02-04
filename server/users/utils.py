# utils.py
from argon2 import PasswordHasher
import jwt
import datetime
import random
import string
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


ph = PasswordHasher()
SECRET_KEY = 'your_secret_key_here'

def generate_token(user_id, role):
    exp_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    token = jwt.encode({'user_id': user_id, 'role': role, 'exp': exp_time}, SECRET_KEY)

    return token

def verify_password(hashed_password, password):
    return ph.verify(hashed_password, password)

def generate_random_password(length=8):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for _ in range(length))

def send_email(receiver_email, message):
    try:
        msg = MIMEMultipart()
        msg['From'] = 'wdaisupersite@gmail.com'
        msg['To'] = receiver_email
        msg['Subject'] = 'Password Reset'

        msg.attach(MIMEText(message, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  
        server.login('wdaisupersite@gmail.com', 'klei teqb xgqw rwyz') 
        text = msg.as_string()
        server.sendmail('wdaisupersite@gmail.com', receiver_email, text)  
        server.quit()  
        print('done')
        return True, None  
    except Exception as e:
        print(e)
        return False, str(e)  
