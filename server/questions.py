# app.py
from flask import Flask
from models import db
from routes import register, login, protected_route, delete_user, modify_user, get_user_data, get_all_users, reset_password, mail, add_question, add_answer, modify_question, modify_answer, search_questions, get_all_questions, get_all_answers, like_question, dislike_question
from flask_jwt_extended import JWTManager
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
app.add_url_rule('/delete_user/<int:user_id>', 'delete_user', delete_user, methods=['DELETE'])
app.add_url_rule('/modify_user/<int:user_id>', 'modify_user', modify_user, methods=['PUT'])
app.add_url_rule("/get_user_data", "get_user_data", get_user_data, methods=["GET"])
app.add_url_rule("/get_all_users", "get_all_users", get_all_users, methods=["GET"])
app.add_url_rule("/reset_password", "reset_password", reset_password, methods=["POST"])

app.add_url_rule('/add_question', 'add_question', add_question, methods=['POST'])
app.add_url_rule('/questions/<int:question_id>/add_answer', 'add_answer', add_answer, methods=['POST'])
app.add_url_rule('/modify_question/<int:question_id>', 'modify_question', modify_question, methods=['PUT'])
app.add_url_rule('/modify_answer/<int:answer_id>', 'modify_answer', modify_answer, methods=['PUT'])
app.add_url_rule('/search_questions', 'search_questions', search_questions, methods=['GET'])
app.add_url_rule('/get_all_questions', 'get_all_questions', get_all_questions, methods=['GET'])
app.add_url_rule('/get_all_answers/<int:question_id>', 'get_all_answers', get_all_answers, methods=['GET'])
app.add_url_rule('/like_question/<int:question_id>', 'like_question', like_question, methods=['POST'])
app.add_url_rule('/dislike_question/<int:question_id>', 'dislike_question', dislike_question, methods=['POST'])

jwt = JWTManager(app)

if __name__ == '__main__':
    if not os.path.exists(f"{app.root_path}/database/users.db"):
        with app.app_context():
            db.create_all()
    app.run(debug=True)

# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(80), nullable=False)
    lastname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(10), nullable=False, default="user") 
    birthday = db.Column(db.DateTime, nullable=False)
    avatar = db.Column(db.String(200), nullable=True)
    about = db.Column(db.Text, nullable=True)


class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    question = db.Column(db.Text, nullable=False)
    tags = db.Column(db.String(255), nullable=True)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    modified_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    likes = db.Column(db.Integer, default=0)
    dislikes = db.Column(db.Integer, default=0)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    views = db.Column(db.Integer, default=0)

    author = db.relationship("User", backref=db.backref("questions", lazy=True))


class Answer(db.Model):
    __tablename__ = "answers"

    id = db.Column(db.Integer, primary_key=True)
    answer = db.Column(db.Text, nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    modified_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    likes = db.Column(db.Integer, default=0)
    dislikes = db.Column(db.Integer, default=0)
    author = db.relationship("User", backref=db.backref("answers", lazy=True))
    question = db.relationship("Question", backref=db.backref("answers", lazy=True))


class QuestionLike(db.Model):
    __tablename__ = "question_likes"
    
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), primary_key=True)
    is_like = db.Column(db.Boolean)  # True for like, False for dislike


class AnswerLike(db.Model):
    __tablename__ = "answer_likes"
    
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    answer_id = db.Column(db.Integer, db.ForeignKey("answers.id"), primary_key=True)
    is_like = db.Column(db.Boolean)  # True for like, False for dislike
# routes.py
from flask import jsonify, request
from models import db, User, Question, Answer, QuestionLike
from utils import generate_token, verify_password, SECRET_KEY, ph
import jwt
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from flask_mail import Mail

mail = Mail()


def register():
    data = request.json

    email = data.get("email")

    if User.query.filter_by(email=email).first():
        return jsonify(message="That email already exists"), 400

    hashed_password = ph.hash(data.get("password"))
    firstname = data.get("firstname")
    lastname = data.get("lastname")

    try:
        birthday = datetime.strptime(data.get("birthday"), "%m/%d/%Y")

        new_user = User(
            firstname=firstname,
            lastname=lastname,
            email=email,
            password=hashed_password,
            birthday=birthday,
        )

        if data.get("role") == "admin":
            new_user.role = "admin"

        db.session.add(new_user)
        db.session.commit()

        return jsonify(message="User added successfully"), 201
    except ValueError:
        return (
            jsonify(
                message="Invalid birthday format. Please provide the birthday in MM/DD/YYYY format."
            ),
            400,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify(message="Failed to register user. Please try again."), 500


def login():
    auth = request.json
    email = auth.get("email")
    password = auth.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify(message="User not found"), 404

    if verify_password(user.password, password):
        token = generate_token(user.id, user.role)
        return jsonify(token=token), 200

    return jsonify(message="Wrong email or password"), 401


def protected_route():
    # To w jsonie dostaje token i zwraca zwiazane z nim id oraz role
    # Jak dobrze rozumiem, to za pomoca tego bedzie decydowane kto co ma zobaczyc

    token = request.json.get("token")

    if not token:
        return jsonify(message="Token is missing"), 401

    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = data.get("user_id")
        role = data.get("role")

        if not user_id or not role:
            return jsonify(message="Invalid token payload"), 401

        return jsonify({"user_id": user_id, "role": role}), 200
    except jwt.ExpiredSignatureError:
        return jsonify(message="Token has expired"), 401
    except jwt.InvalidTokenError:
        return jsonify(message="Invalid token"), 401


def delete_user():
    # Tu zakladam, ze tylko u admina bedzie to wykorzystywane
    data = request.json
    user_id = data.get("to_delete_id")

    try:
        user_to_delete = User.query.get(user_id)

        if not user_to_delete:
            return jsonify(message="User not found"), 404

        if user_to_delete.role == "admin":
            return jsonify(message="Can not delete admin"), 404

        db.session.delete(user_to_delete)
        db.session.commit()

        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


def modify_user():
    data = request.json
    # Nwm czy dobrze, ale zakladam, ze potrzebne dane zostana wyslane w w jsonie
    # Jezeli nie ma to_modify_id przeslanego to zalozenie jest takie,
    # ze to nie admin chce cos zmienic, tylko zwykly uzytkownik

    print(data)

    try:
        user_id = data.get("user_id")
        to_modify_id = data.get("to_modify_id")

        modifier = User.query.get(user_id)

        if not modifier:
            return jsonify({"message": "Modifier not found"}), 404

        if modifier.role != "admin" and to_modify_id:
            if to_modify_id != user_id:
                return jsonify({"message": "You can only modify your own account"}), 403

        if to_modify_id:
            user_to_modify = User.query.get(to_modify_id)
        else:
            user_to_modify = modifier

        fields_to_update = {
            "firstname": data.get("firstname"),
            "lastname": data.get("lastname"),
            "email": data.get("email"),
            "role": (
                data.get("role") if data.get("role") != "user" else user_to_modify.role
            ),
            "avatar": data.get("avatar"),
            "about": data.get("about"),
            "password": ph.hash(data.get("password")) if data.get("password") else None,
            "birthday": (
                datetime.strptime(data.get("birthday"), "%m/%d/%Y")
                if data.get("birthday")
                else None
            ),
        }

        for field, value in fields_to_update.items():
            if value is not None:
                setattr(user_to_modify, field, value)

        db.session.commit()

        return jsonify({"message": "User modified successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


def get_user_data():
    # Tutaj dane poszczegolnego usera
    # Mozliwe, ze jakiegos pole tutaj nie musi byc

    user_id = request.json.get("user_id")

    try:
        if not user_id:
            return jsonify(message="User ID is missing in the request"), 400

        user = User.query.get(user_id)

        if not user:
            return jsonify(message="User not found"), 404

        user_data = {
            "firstname": user.firstname,
            "lastname": user.lastname,
            "email": user.email,
            "role": user.role,
            "avatar": user.avatar,
            "about": user.about,
            "birthday": user.birthday.strftime("%m/%d/%Y"),
        }

        return jsonify(user_data), 200
    except Exception as e:
        return jsonify(message=str(e)), 500


def get_all_users():
    # Moze sie przyda do jakiegos wyswietlania wszystkich uzytkownikow do usuniecia/modyfikowania, czy cos takiego
    users = User.query.all()

    try:

        if not users:
            return jsonify(message="No users found"), 404

        all_users_data = []
        for user in users:
            user_data = {
                "firstname": user.firstname,
                "lastname": user.lastname,
                "email": user.email,
                "role": user.role,
                "avatar": user.avatar,
                "about": user.about,
                "birthday": (
                    user.birthday.strftime("%m/%d/%Y") if user.birthday else None
                ),
            }
            all_users_data.append(user_data)

        # Return the list of user data dictionaries as JSON
        return jsonify(all_users_data), 200

    except Exception as e:
        return jsonify(message=str(e)), 500

    return jsonify(message="Failed to reset password. Please try again."), 500


def reset_password():
    data = request.json
    email = data.get("email")
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify(message="Email not found"), 404

    new_password = generate_random_password()
    hashed_password = ph.hash(new_password)

    try:
        user.password = hashed_password
        db.session.commit()

        email_message = f"Your new password is: {new_password}"

        receiver_email = email

        success, error_message = send_email(receiver_email, email_message)

        if success:
            return (
                jsonify(
                    message="Password reset successful. Check your email for the new password."
                ),
                200,
            )
        else:
            return (
                jsonify(message=f"Failed to reset password. Error: {error_message}"),
                500,
            )

    except Exception as e:
        db.session.rollback()
        return jsonify(message="Failed to reset password. Please try again."), 500


@jwt_required()
def add_question():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    question = Question(
        title=data['title'],
        question=data['question'],
        tags=data['tags'],
        author_id=current_user_id
    )
    db.session.add(question)
    db.session.commit()
    return jsonify({'message': 'Question added successfully', 'question_id': question.id}), 201


@jwt_required()
def add_answer(question_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    answer = Answer(
        answer=data['answer'],
        question_id=question_id,
        author_id=current_user_id
    )
    db.session.add(answer)
    db.session.commit()
    return jsonify({'message': 'Answer added successfully', 'answer_id': answer.id}), 201


@jwt_required()
def modify_question(question_id):
    current_user_id = get_jwt_identity()
    question = Question.query.filter_by(id=question_id, author_id=current_user_id).first()

    if question is None:
        return jsonify({'message': 'Question not found or you do not have permission to modify it'}), 404

    data = request.get_json()
    question.title = data.get('title', question.title)
    question.question = data.get('question', question.question)
    question.tags = data.get('tags', question.tags)
    question.modified_at = datetime.utcnow()

    db.session.commit()
    return jsonify({'message': 'Question updated successfully'}), 200


@jwt_required()
def modify_answer(answer_id):
    current_user_id = get_jwt_identity()
    answer = Answer.query.filter_by(id=answer_id, author_id=current_user_id).first()

    if answer is None:
        return (
            jsonify(
                {
                    "message": "Answer not found or you do not have permission to modify it"
                }
            ),
            404,
        )

    data = request.get_json()
    answer.answer = data.get("answer", answer.answer)
    answer.modified_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"message": "Answer updated successfully"}), 200


def search_questions():
    query = request.args.get("text", "")
    tags = request.args.getlist("tags")
    sort_by = request.args.get("sortedBy", "added_at")
    skip = int(request.args.get("skip", 0))
    limit = int(request.args.get("limit", 100))

    questions_query = Question.query

    if query:
        questions_query = questions_query.filter(
            Question.title.contains(query) | Question.question.contains(query)
        )
    if tags:
        for tag in tags:
            questions_query = questions_query.filter(Question.tags.contains(tag))

    # Sortowanie wyników
    if sort_by == "addedAt":
        questions_query = questions_query.order_by(Question.added_at.desc())
    elif sort_by == "modifiedAt":
        questions_query = questions_query.order_by(Question.modified_at.desc())
    elif sort_by == "likes":
        questions_query = questions_query.order_by(Question.likes.desc())

    questions_page = questions_query.offset(skip).limit(limit).all()

    questions_data = [
        {
            "id": question.id,
            "title": question.title,
            "question": question.question,
            "tags": question.tags,
            "added_at": question.added_at,
            "modified_at": question.modified_at,
            "likes": question.likes,
            "author_id": question.author_id,
        }
        for question in questions_page
    ]

    return jsonify(questions_data), 200


def get_all_questions():
    questions = Question.query.all()
    questions_data = [
        {
            "id": question.id,
            "title": question.title,
            "question": question.question,
            "tags": question.tags,
            "added_at": question.added_at.strftime("%Y-%m-%d %H:%M:%S"),
            "modified_at": question.modified_at.strftime("%Y-%m-%d %H:%M:%S"),
            "likes": question.likes,
            "dislikes": question.dislikes,
            "author_id": question.author_id,
            "views": question.views,
        }
        for question in questions
    ]

    return jsonify(questions_data), 200

def get_all_answers(question_id):
    answers = Answer.query.filter_by(question_id=question_id).all()
    if not answers:
        return jsonify(message="No answers found for this question"), 404

    answers_data = [{
        'id': answer.id,
        'answer': answer.answer,
        'question_id': answer.question_id,
        'author_id': answer.author_id,
        'added_at': answer.added_at.strftime("%Y-%m-%d %H:%M:%S"),
        'modified_at': answer.modified_at.strftime("%Y-%m-%d %H:%M:%S"),
        'likes': answer.likes
    } for answer in answers]

    return jsonify(answers_data), 200


@jwt_required()
def like_question(question_id):
    current_user_id = get_jwt_identity()
    question = Question.query.get(question_id)

    if not question:
        return jsonify({"message": "Question not found"}), 404

    existing_reaction = QuestionLike.query.filter_by(
        user_id=current_user_id, question_id=question_id
    ).first()

    if existing_reaction:
        if existing_reaction.is_like:
            return jsonify({"message": "User has already liked this question"}), 400
        else:
            existing_reaction.is_like = True
            question.likes += 1
            question.dislikes -= 1
    else:
        db.session.add(
            QuestionLike(user_id=current_user_id, question_id=question_id, is_like=True)
        )
        question.likes += 1

    db.session.commit()

    return jsonify({"message": "Question liked successfully"}), 200


@jwt_required()
def dislike_question(question_id):
    current_user_id = get_jwt_identity()
    question = Question.query.get(question_id)

    if not question:
        return jsonify({"message": "Question not found"}), 404

    existing_reaction = QuestionLike.query.filter_by(
        user_id=current_user_id, question_id=question_id
    ).first()

    if existing_reaction:
        if not existing_reaction.is_like:
            return jsonify({"message": "User has already disliked this question"}), 400
        else:
            existing_reaction.is_like = False
            question.dislikes += 1
            question.likes -= 1
    else:
        db.session.add(
            QuestionLike(
                user_id=current_user_id, question_id=question_id, is_like=False
            )
        )
        question.dislikes += 1

    db.session.commit()

    return jsonify({"message": "Question disliked successfully"}), 200
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
    token = jwt.encode({"sub": user_id, "role": role, "exp": exp_time}, SECRET_KEY)

    return token


def verify_password(hashed_password, password):
    return ph.verify(hashed_password, password)


def generate_random_password(length=8):
    characters = string.ascii_letters + string.digits + string.punctuation
    return "".join(random.choice(characters) for _ in range(length))


def send_email(receiver_email, message):
    try:
        msg = MIMEMultipart()
        msg["From"] = "wdaisupersite@gmail.com"
        msg["To"] = receiver_email
        msg["Subject"] = "Password Reset"

        msg.attach(MIMEText(message, "plain"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login("wdaisupersite@gmail.com", "klei teqb xgqw rwyz")
        text = msg.as_string()
        server.sendmail("wdaisupersite@gmail.com", receiver_email, text)
        server.quit()
        print("done")
        return True, None
    except Exception as e:
        print(e)
        return False, str(e)
