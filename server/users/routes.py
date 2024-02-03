# routes.py
from flask import jsonify, request
from models import db, User
from utils import generate_token, verify_password, SECRET_KEY, ph
import jwt

def register():
    data = request.json
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    password = data.get('password')

    hashed_password = ph.hash(password)

    new_user = User(firstname=firstname, lastname=lastname, email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User added successfully'}), 201

def login():
    auth = request.json
    email = auth.get('email')
    password = auth.get('password')

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    if verify_password(user.password, password):
        token = generate_token(user.id, user.role)
        return jsonify({'token': token}), 200

    return jsonify({'message': 'Invalid credentials'}), 401

def protected_route():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        data = jwt.decode(token, SECRET_KEY)
        return jsonify({'role': data['role']}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

def delete_user(user_id):
    response, status_code = protected_route()

    if status_code != 200:
        return response, status_code

    role = response.get('role')

    try:
        if role != 'admin':
            return jsonify({'message': 'Insufficient permissions'}), 403

        user_to_delete = User.query.get(user_id)

        if not user_to_delete:
            return jsonify({'message': 'User not found'}), 404

        db.session.delete(user_to_delete)
        db.session.commit()

        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

def modify_user(user_id):
    response, status_code = protected_route()

    if status_code != 200:
        return response, status_code

    role = response.get('role')

    try:
        user_to_modify = User.query.get(user_id)
        
        if not user_to_modify:
            return jsonify({'message': 'User not found'}), 404

        data = request.json

        if role == 'admin' or user_to_modify.id == response.get('user_id'):
            firstname = data.get('firstname')
            lastname = data.get('lastname')
            email = data.get('email')
            password = data.get('password')
            new_role = data.get('role')
            avatar = data.get('avatar')
            about = data.get('about')

            user_to_modify.firstname = firstname
            user_to_modify.lastname = lastname
            user_to_modify.email = email
            user_to_modify.role = new_role if role == 'admin' else user_to_modify.role
            user_to_modify.avatar = avatar
            user_to_modify.about = about

            if password:
                hashed_password = ph.hash(password)
                user_to_modify.password = hashed_password

            db.session.commit()

            return jsonify({'message': 'User modified successfully'}), 200
        else:
            return jsonify({'message': 'Insufficient permissions'}), 403
    except Exception as e:
        return jsonify({'message': str(e)}), 500
