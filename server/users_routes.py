# routes.py
from datetime import datetime

from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask_mail import Mail

from models import db, User
from utils import generate_token, verify_password, ph, generate_random_password, send_email, generate_reset_token

mail = Mail()


def register():
    data = request.json

    email = data.get('email')

    if User.query.filter_by(email=email).first():
        return jsonify(message="That email already exists"), 400

    hashed_password = ph.hash(data.get('password'))
    firstname = data.get('firstname')
    lastname = data.get('lastname')

    try:
        birthday = datetime.strptime(data.get('birthday'), '%m/%d/%Y')

        new_user = User(
            firstname=firstname,
            lastname=lastname,
            email=email,
            password=hashed_password,
            birthday=birthday
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify(message='User added successfully'), 201
    except ValueError:
        return jsonify(message='Invalid birthday format. Please provide the birthday in MM/DD/YYYY format.'), 400

    except Exception as e:
        db.session.rollback()
        return jsonify(message='Failed to register user. Please try again.'), 500


def login():
    auth = request.json
    email = auth.get('email')
    password = auth.get('password')
    user = User.query.filter_by(email=email).first()
    try:
        if verify_password(user.password, password):
            token = generate_token(user.id, user.role)
            return jsonify(token=token), 200
    except Exception as e:
        return jsonify(message='Wrong email or password'), 401


@jwt_required()
def protected_route():
    user_id = get_jwt_identity()
    role = get_jwt().get('role')

    if not user_id or not role:
        return jsonify(message='Invalid token payload'), 401

    return jsonify({'user_id': user_id, 'role': role}), 200


@jwt_required()
def delete_user(user_to_delete_id):
    role = get_jwt().get('role')

    if role != 'admin':
        return jsonify(message="You must be an admin to perform this action"), 403

    if not user_to_delete_id:
        return jsonify(message='User ID to delete is missing'), 400

    try:
        user_to_delete = User.query.get(user_to_delete_id)

        if not user_to_delete:
            return jsonify(message='User not found'), 404

        if user_to_delete.role == 'admin':
            return jsonify(message="Can not delete admin"), 403

        db.session.delete(user_to_delete)
        db.session.commit()

        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500


@jwt_required()
def modify_user(user_to_modify_id):
    modifier = get_jwt_identity()
    modifier_role = get_jwt().get('role')
    data = request.json
    user_to_modify = User.query.get(user_to_modify_id)

    if not modifier:
        return jsonify({'message': 'Modifier not found'}), 404

    if modifier_role != 'admin' and user_to_modify_id != modifier:
        return jsonify({'message': 'You can only modify your own account'}), 403

    try:
        fields_to_update = {
            'firstname': data.get('firstname'),
            'lastname': data.get('lastname'),
            'email': data.get('email'),
            'role': data.get('role') if data.get('role') != 'user' else user_to_modify.role,
            'avatar': data.get('avatar'),
            'about': data.get('about'),
            'password': ph.hash(data.get('password')) if data.get('password') else None,
            'birthday': datetime.strptime(data.get('birthday'), '%m/%d/%Y') if data.get('birthday') else None
        }

        for field, value in fields_to_update.items():
            if value is not None:
                setattr(user_to_modify, field, value)

        db.session.commit()

        return jsonify({'message': 'User modified successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500


def get_user_data(user_id):
    # Tutaj dane poszczegolnego usera
    # Mozliwe, ze jakiegos pole tutaj nie musi byc

    try:
        if not user_id:
            return jsonify(message='User ID is missing in the request'), 400

        user = User.query.get(user_id)

        if not user:
            return jsonify(message='User not found'), 404

        user_data = {
            'firstname': user.firstname,
            'lastname': user.lastname,
            'email': user.email,
            'role': user.role,
            'avatar': user.avatar,
            'about': user.about,
            'birthday': user.birthday.strftime('%m/%d/%Y')
        }

        return jsonify(user_data), 200
    except Exception as e:
        return jsonify(message=str(e)), 500


def get_all_users():
    # Moze sie przyda do jakiegos wyswietlania wszystkich uzytkownikow do usuniecia/modyfikowania, czy cos takiego
    users = User.query.all()

    try:

        if not users:
            return jsonify(message='No users found'), 404

        all_users_data = []
        for user in users:
            user_data = {
                'firstname': user.firstname,
                'lastname': user.lastname,
                'email': user.email,
                'role': user.role,
                'avatar': user.avatar,
                'about': user.about,
                'birthday': user.birthday.strftime('%m/%d/%Y') if user.birthday else None
            }
            all_users_data.append(user_data)

        return jsonify(all_users_data), 200

    except Exception as e:
        return jsonify(message=str(e)), 500


# NOWA WERSJA
def reset_password_request(email):
    user = User.query.filter_by(email=email).first()

    token = generate_reset_token(email, user.id)

    # ten url najprawdopodobniej do zmiany
    # Tez nie wiedzialem czy dokladnie to miales na mysli
    # Ale no wysyla to maila do konkretnej strony wraz z tokenem 
    # I za pomoca tego tokenu mozna potem w change password zmienic haslo
    reset_url = f'localhost:3000/reset_password?token={token}'

    message = f'Click the following link to reset your password: {reset_url}'

    try:

        success, error = send_email(email, message)

        if success:
            return jsonify(message='Password reset email sent successfully'), 200
        else:
            return jsonify(message=f'Failed to send email: {error}'), 500

    except Exception as e:
        return jsonify(message=str(e)), 500


@jwt_required()
def change_password():
    new_password = request.json.get('new_password')
    user_to_modify = User.query.filter_by(email=get_jwt().get('email')).first()

    if not new_password:
        return jsonify(message='New password is required'), 400

    hashed_password = ph.hash(new_password)

    try:
        user_to_modify.password = hashed_password
        db.session.commit()
        return jsonify(message='Password changed successfully'), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500


# STARA WERSJA
def reset_password(email):
    user = User.query.filter_by(email=email).first()

    new_password = generate_random_password()
    hashed_password = ph.hash(new_password)

    try:
        user.password = hashed_password
        db.session.commit()

        email_message = f'Your new password is: {new_password}'

        receiver_email = email

        success, error_message = send_email(receiver_email, email_message)

        if success:
            return jsonify(message='Password reset successful. Check your email for the new password.'), 200
        else:
            return jsonify(message=f'Failed to reset password. Error: {error_message}'), 500

    except Exception as e:
        db.session.rollback()
        return jsonify(message='Failed to reset password. Please try again.'), 500
