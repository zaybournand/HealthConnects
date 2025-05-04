from flask import Flask, url_for, request, redirect, render_template, flash, jsonify, session
from flask_migrate import Migrate 
from flask_sqlalchemy import SQLAlchemy 
from flask_login import LoginManager, logout_user, login_user, current_user, UserMixin, login_required
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from uuid import uuid4
import os
app = Flask(__name__)

app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)
CORS(app, supports_credentials=True)
login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

def get_uuid():
    return uuid4().hex

@login_manager.user_loader

def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    __tablename__ = "users"
    id = db.Column(db.String(11), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.Text, nullable=False)
    

    def __repr__(self):
        return f"<User {self.email}>"

class Opportunity(db.Model):
    __tablename__ = "opportunities"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "email": self.email
        }

with app.app_context():
    db.create_all()

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        # This is only hit when Flask-Login redirects to /login after logout
        return jsonify({"message": "Please log in via POST with credentials."}), 200

    # Handle POST (actual login)
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()
    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    login_user(user)
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })


@app.route("/signup", methods=["POST"])
def signup():
    email = request.json["email"]
    password = request.json["password"]

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409

    # Create a new user and hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()

    # Log the user in using Flask-Login
    login_user(new_user)  # This line is now correct
    
    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })


@app.route('/logout')
@login_required
def logout():
    logout_user()
    session.clear()
    return jsonify({"message": "Successfully logged out"}), 200

@app.route("/opportunities", methods=["GET"])
def get_opportunities():
    all_opps = Opportunity.query.all()
    return jsonify([opp.to_dict() for opp in all_opps])

@app.route("/opportunities", methods=["POST"])

def create_opportunity():
    data = request.json
    print("Received opportunity:", data)
    new_opp = Opportunity(
        title=data["title"],
        description=data["description"],
        location=data["location"],
        email=data["email"]
    )
    db.session.add(new_opp)
    db.session.commit()
    return jsonify(new_opp.to_dict()), 201


if __name__ == "__main__":
    app.run(debug=True)


