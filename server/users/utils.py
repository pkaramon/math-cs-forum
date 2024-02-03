# utils.py
from argon2 import PasswordHasher
import jwt
import datetime

ph = PasswordHasher()
SECRET_KEY = 'your_secret_key_here'

def generate_token(user_id, role):
    # To jeszcze do przeanalizowania
    exp_time = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    token = jwt.encode({'user_id': user_id, 'role': role, 'exp': exp_time}, SECRET_KEY)
    return token.decode('UTF-8')

def verify_password(hashed_password, password):
    return ph.verify(hashed_password, password)