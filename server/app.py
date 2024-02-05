# app.py
from flask import Flask
from models import db
from users_routes import register, login, protected_route, delete_user, modify_user, get_user_data, get_all_users, reset_password, mail, reset_password_request, change_password
from questions_routes import add_question, add_answer, modify_question, modify_answer, search_questions, get_all_questions, get_all_answers, like_question, dislike_question, like_answer, dislike_answer, delete_question, delete_answer
from utils import register_error_handlers, jwt_manager, SECRET_KEY
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{app.root_path}/database/database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'
app.config['JWT_SECRET_KEY'] = SECRET_KEY

register_error_handlers(app)
jwt_manager.init_app(app)

mail.init_app(app)

# users
app.add_url_rule('/register', 'register', register, methods=['POST'])
app.add_url_rule('/login', 'login', login, methods=['POST'])
app.add_url_rule('/protected', 'protected_route', protected_route, methods=['GET'])
app.add_url_rule('/delete_user/<int:user_to_delete_id>', 'delete_user', delete_user, methods=['DELETE'])
app.add_url_rule('/modify_user/<int:user_to_modify_id>', 'modify_user', modify_user, methods=['PUT'])
app.add_url_rule('/get_user_data/<int:user_id>', 'get_user_data', get_user_data, methods=['GET'])
app.add_url_rule('/get_all_users', 'get_all_users', get_all_users, methods=['GET'])

# Na razie nie uzywane
app.add_url_rule('/reset_password/<string:email>', 'reset_password', reset_password, methods=['POST'])
# To jest uzywane
app.add_url_rule('/reset_password_request/<string:email>', 'reset_password_request', reset_password_request, methods=['POST'])
app.add_url_rule('/change_password/', 'change_password', change_password, methods=['POST'])


# questions
app.add_url_rule('/add_question', 'add_question', add_question, methods=['POST'])
app.add_url_rule('/questions/<int:question_id>/add_answer', 'add_answer', add_answer, methods=['POST'])
app.add_url_rule('/modify_question/<int:question_id>', 'modify_question', modify_question, methods=['PUT'])
app.add_url_rule('/modify_answer/<int:answer_id>', 'modify_answer', modify_answer, methods=['PUT'])
app.add_url_rule('/search_questions', 'search_questions', search_questions, methods=['GET'])
app.add_url_rule('/get_all_questions', 'get_all_questions', get_all_questions, methods=['GET'])
app.add_url_rule('/get_all_answers/<int:question_id>', 'get_all_answers', get_all_answers, methods=['GET'])
app.add_url_rule('/like_question/<int:question_id>', 'like_question', like_question, methods=['POST'])
app.add_url_rule('/dislike_question/<int:question_id>', 'dislike_question', dislike_question, methods=['POST'])
app.add_url_rule("/like_answer/<int:answer_id>", "like_answer", like_answer, methods=["POST"])
app.add_url_rule('/dislike_answer/<int:answer_id>', 'dislike_answer', dislike_answer, methods=['POST'])
app.add_url_rule('/delete_question/<int:question_id>', 'delete_question', delete_question, methods=['DELETE'])
app.add_url_rule('/delete_answer/<int:answer_id>', 'delete_answer', delete_answer, methods=['DELETE'])

if __name__ == '__main__':
    if not os.path.exists(f"{app.root_path}/database/database.db"):
        with app.app_context():
            db.create_all()
    app.run()
