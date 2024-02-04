# app.py
from flask import Flask
from models import db
from routes import register, login, protected_route, delete_user, modify_user, get_user_data, get_all_users, reset_password, mail
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{app.root_path}/database/users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

mail.init_app(app)

app.add_url_rule('/register', 'register', register, methods=['POST'])
app.add_url_rule('/login', 'login', login, methods=['POST'])
app.add_url_rule('/protected', 'protected_route', protected_route, methods=['GET'])
app.add_url_rule('/delete_user', 'delete_user', delete_user, methods=['DELETE'])
app.add_url_rule('/modify_user', 'modify_user', modify_user, methods=['PUT'])
app.add_url_rule('/get_user_data', 'get_user_data', get_user_data, methods=['GET'])
app.add_url_rule('/get_all_users', 'get_all_users', get_all_users, methods=['GET'])
app.add_url_rule('/reset_password', 'reset_password', reset_password, methods=['POST'])

if __name__ == '__main__':
    if not os.path.exists(f"{app.root_path}/database/users.db"):
        with app.app_context():
            db.create_all()
    app.run()