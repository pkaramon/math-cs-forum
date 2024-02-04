# routes.py
from flask import jsonify, request
from models import db, User
from utils import generate_token, verify_password, SECRET_KEY, ph, generate_random_password, send_email
import jwt
from datetime import datetime 
from flask_mail import Mail

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
        
        if data.get('role') == 'admin':
            new_user.role = 'admin';


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

    if not user:
        return jsonify(message='User not found'), 404

    if verify_password(user.password, password):
        token = generate_token(user.id, user.role)
        return jsonify(token=token), 200

    return jsonify(message='Wrong email or password'), 401

def protected_route():
    # To w jsonie dostaje token i zwraca zwiazane z nim id oraz role
    # Jak dobrze rozumiem, to za pomoca tego bedzie decydowane kto co ma zobaczyc

    token = request.json.get('token')

    if not token:
        return jsonify(message='Token is missing'), 401

    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = data.get('user_id')
        role = data.get('role')

        if not user_id or not role:
            return jsonify(message='Invalid token payload'), 401

        return jsonify({'user_id': user_id, 'role': role}), 200
    except jwt.ExpiredSignatureError:
        return jsonify(message='Token has expired'), 401
    except jwt.InvalidTokenError:
        return jsonify(message='Invalid token'), 401

def delete_user():
    # Tu zakladam, ze tylko u admina bedzie to wykorzystywane 
    data = request.json
    user_id = data.get('to_delete_id')

    try:
        user_to_delete = User.query.get(user_id)

        if not user_to_delete:
            return jsonify(message='User not found'), 404
        
        if user_to_delete.role == 'admin':
            return jsonify(message="Can not delete admin"), 404

        db.session.delete(user_to_delete)
        db.session.commit()

        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()  
        return jsonify({'message': str(e)}), 500

def modify_user():
    data = request.json
    # Nwm czy dobrze, ale zakladam, ze potrzebne dane zostana wyslane w w jsonie
    # Jezeli nie ma to_modify_id przeslanego to zalozenie jest takie, 
    # ze to nie admin chce cos zmienic, tylko zwykly uzytkownik

    print(data)

    try:
        user_id = data.get('user_id')
        to_modify_id = data.get('to_modify_id')  

        modifier = User.query.get(user_id)
       
        if not modifier:
            return jsonify({'message': 'Modifier not found'}), 404
        
        if modifier.role != 'admin' and to_modify_id:
            if to_modify_id != user_id:
                return jsonify({'message': 'You can only modify your own account'}), 403


        if to_modify_id:
            user_to_modify = User.query.get(to_modify_id)
        else:
            user_to_modify = modifier
            

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

def get_user_data():
    # Tutaj dane poszczegolnego usera
    # Mozliwe, ze jakiegos pole tutaj nie musi byc

    user_id = request.json.get('user_id')

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

        # Return the list of user data dictionaries as JSON
        return jsonify(all_users_data), 200

    except Exception as e:
        return jsonify(message=str(e)), 500

    return jsonify(message='Failed to reset password. Please try again.'), 500

def reset_password():
    data = request.json
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify(message='Email not found'), 404

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