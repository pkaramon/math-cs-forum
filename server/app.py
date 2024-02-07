# app.py
from flask import Flask
from flask_cors import CORS

import questions_routes
import users_routes
from models import db
from utils import register_error_handlers, jwt_manager, SECRET_KEY

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

users_routes.mail.init_app(app)

# users
app.add_url_rule('/register', 'register', users_routes.register, methods=['POST'])
app.add_url_rule('/login', 'login', users_routes.login, methods=['POST'])
app.add_url_rule('/protected', 'protected_route', users_routes.protected_route, methods=['GET'])
app.add_url_rule('/get_public_profile_info/<int:user_id>', 'get_public_profile_info',
                 users_routes.get_public_profile_info,
                 methods=['GET'])
app.add_url_rule('/delete_user/<int:user_to_delete_id>', 'delete_user', users_routes.delete_user, methods=['DELETE'])
app.add_url_rule('/modify_user/<int:user_to_modify_id>', 'modify_user', users_routes.modify_user, methods=['PUT'])
app.add_url_rule('/modify_user_details', 'modify_user_details', users_routes.modify_user_details, methods=['PUT'])
app.add_url_rule('/get_user_details', 'get_user_details', users_routes.get_user_details, methods=['GET'])
app.add_url_rule('/get_user_data/<int:user_id>', 'get_user_data', users_routes.get_user_data, methods=['GET'])
app.add_url_rule('/get_all_users', 'get_all_users', users_routes.get_all_users, methods=['GET'])

# To jest uzywane
app.add_url_rule('/reset_password_request/<string:email>', 'reset_password_request',
                 users_routes.reset_password_request,
                 methods=['POST'])
app.add_url_rule('/change_password', 'change_password', users_routes.change_password, methods=['POST'])

# questions
app.add_url_rule('/add_question', 'add_question', questions_routes.add_question, methods=['POST'])
app.add_url_rule('/get_question/<int:question_id>', 'get_question', questions_routes.get_question, methods=['GET'])
app.add_url_rule('/get_answer/<int:answer_id>', 'get_answer', questions_routes.get_answer, methods=['GET'])
app.add_url_rule('/questions/<int:question_id>/add_answer', 'add_answer', questions_routes.add_answer, methods=['POST'])
app.add_url_rule('/modify_question/<int:question_id>', 'modify_question', questions_routes.modify_question,
                 methods=['PUT'])
app.add_url_rule('/modify_answer/<int:answer_id>', 'modify_answer', questions_routes.modify_answer, methods=['PUT'])
app.add_url_rule('/search_questions', 'search_questions', questions_routes.search_questions, methods=['GET'])
app.add_url_rule('/search_answers', 'search_answers', questions_routes.search_answers, methods=['GET'])
app.add_url_rule('/get_number_of_questions_matching', 'get_number_of_questions_matching',
                 questions_routes.get_number_of_questions_matching, methods=['GET'])
app.add_url_rule('/toggle_verified_answer/<int:answer_id>', 'toggle_verified_answer',
                 questions_routes.toggle_verified_answer, methods=['POST'])

app.add_url_rule('/get_all_questions', 'get_all_questions', questions_routes.get_all_questions, methods=['GET'])
app.add_url_rule('/get_all_answers/<int:question_id>', 'get_all_answers', questions_routes.get_all_answers,
                 methods=['GET'])
app.add_url_rule('/like_question/<int:question_id>', 'like_question', questions_routes.like_question, methods=['POST'])
app.add_url_rule('/dislike_question/<int:question_id>', 'dislike_question', questions_routes.dislike_question,
                 methods=['POST'])
app.add_url_rule("/like_answer/<int:answer_id>", "like_answer", questions_routes.like_answer, methods=["POST"])
app.add_url_rule('/dislike_answer/<int:answer_id>', 'dislike_answer', questions_routes.dislike_answer, methods=['POST'])
app.add_url_rule('/delete_question/<int:question_id>', 'delete_question', questions_routes.delete_question,
                 methods=['DELETE'])
app.add_url_rule('/delete_answer/<int:answer_id>', 'delete_answer', questions_routes.delete_answer, methods=['DELETE'])
app.add_url_rule('/view_question/<int:question_id>', 'view_question', questions_routes.view_question, methods=['POST'])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run()
