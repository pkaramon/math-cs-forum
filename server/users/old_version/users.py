import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from argon2 import PasswordHasher
import jwt
import datetime

app = Flask(__name__)

# Secret key for encoding/decoding JWTs
app.config['SECRET_KEY'] = 'your_secret_key_here'

# Database configuration
database_file = "users.db"
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{database_file}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
ph = PasswordHasher()

# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(80), nullable=False)
    lastname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(10), nullable=False, default="user") 
    avatar = db.Column(db.String(200), nullable=True)
    about = db.Column(db.Text, nullable=True)


# Routes
@app.route('/register', methods=['POST'])
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

@app.route('/login', methods=['POST'])
def login():
    auth = request.json
    email = auth.get('email')
    password = auth.get('password')

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    if ph.verify(user.password, password):
        token = jwt.encode({'user_id': user.id, 'role': user.role, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        return jsonify({'token': token.decode('UTF-8')}), 200

    return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/protected', methods=['GET'])
def protected_route():
    # Powinno się przydać do wszystkich stron gdzie potrzeba sprawdzić token
    # Ale jeszcze dobrze musze przeanalizowac to dzialanie tokenow 
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        data = jwt.decode(token, app.config['SECRET_KEY'])
        return jsonify({'role': data['role']}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

@app.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Use the protected_route function to verify token and role
    response, status_code = protected_route()

    # Check if the response status code is not 200 (indicating an error)
    if status_code != 200:
        return response, status_code

    # Extract the role from the response data
    role = response.get('role')

    try:
        # Check if the user has admin role
        if role != 'admin':
            return jsonify({'message': 'Insufficient permissions'}), 403

        # Find the user by user_id
        user_to_delete = User.query.get(user_id)
        
        # Check if the user exists
        if not user_to_delete:
            return jsonify({'message': 'User not found'}), 404

        # Delete the user from the database
        db.session.delete(user_to_delete)
        db.session.commit()

        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/modify_user/<int:user_id>', methods=['PUT'])
def modify_user(user_id):
    # Use the protected_route function to verify token and role
    response, status_code = protected_route()

    # Check if the response status code is not 200 (indicating an error)
    if status_code != 200:
        return response, status_code

    # Extract the role from the response data
    role = response.get('role')

    try:
        # Find the user by user_id
        user_to_modify = User.query.get(user_id)
        
        # Check if the user exists
        if not user_to_modify:
            return jsonify({'message': 'User not found'}), 404

        # Extract data from the request
        data = request.json

        # Allow normal users to modify their own account information
        if role == 'admin' or user_to_modify.id == response.get('user_id'):
            firstname = data.get('firstname')
            lastname = data.get('lastname')
            email = data.get('email')
            password = data.get('password')
            new_role = data.get('role')
            avatar = data.get('avatar')
            about = data.get('about')

            # Modify user attributes
            user_to_modify.firstname = firstname
            user_to_modify.lastname = lastname
            user_to_modify.email = email
            user_to_modify.role = new_role if role == 'admin' else user_to_modify.role
            user_to_modify.avatar = avatar
            user_to_modify.about = about

            # Hash the password before storing (if provided)
            if password:
                hashed_password = ph.hash(password)
                user_to_modify.password = hashed_password

            # Commit changes to the database
            db.session.commit()

            return jsonify({'message': 'User modified successfully'}), 200
        else:
            return jsonify({'message': 'Insufficient permissions'}), 403
    except Exception as e:
        return jsonify({'message': str(e)}), 500



if __name__ == '__main__':
    # Wygląda to na razie dziwnie, ale jeszcze przeanalizuje czy musi to tak wyglądać
    # I też chyba do kónca nie dziala 
    try:
        with app.app_context():
            if not os.path.exists(database_file):
                db.create_all()
    except Exception as e:
        print(f"Error occurred while creating database tables: {e}")

    app.run(debug=True)