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
    __tablename__ = 'opportunities'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(120), nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    professional_id = db.Column(db.String(11), db.ForeignKey('users.id'), nullable=False)

    professional = db.relationship('User', backref='posted_opportunities', lazy=True)

    def __repr__(self):
        return f"<Opportunity {self.title}, posted by {self.professional_id}>"

# Define the Application model>"

class Application(db.Model):
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    opportunity_id = db.Column(db.Integer, db.ForeignKey('opportunities.id'), nullable=False)
    student_id = db.Column(db.String(11), db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(50), default="Pending")

    opportunity = db.relationship('Opportunity', backref='applications', lazy=True)
    student = db.relationship('User', backref='applied_opportunities', lazy=True)

    def __repr__(self):
        return f"<Application by User {self.student_id} for Opportunity {self.opportunity_id} with status {self.status}>"

with app.app_context():
    db.create_all()

@app.route("/login", methods=["POST"])
def login():
    email = request.json["email"]
    password = request.json["password"]

    
    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401

    
    if not bcrypt.check_password_hash(user.password, password):
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



@app.route('/api/application_status/<int:id>', methods=['GET', 'POST'])
@login_required
def api_status(id):
    application_status = Application.query.get_or_404(id)
    if application_status.professional_id != current_user.id:
        return jsonify({'error': 'You are not authorized to edit this opportunity.'}), 403
    
    if request.method == 'GET':
        return jsonify({'status': application_status.status})
    
    if request.method == 'POST':
        new_status = request.json.get('status')
        if new_status:
            application_status.status = new_status
            try:
                db.session.commit()
                return jsonify({'message': 'Application status updated successfully!'})
            except Exception as e:
                return jsonify({'error': f'There was an error updating status: {e}'}), 500
        return jsonify({'error': 'Invalid status'}), 400

@app.route('/api/update_profile', methods=['POST'])
@login_required
def profile_update():
    user_update = User.query.get_or_404(current_user.id) 
    
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    user_type = data.get('user_type')

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match!"}), 400

    if password:
        user_update.password = generate_password_hash(password) 

    user_update.username = username
    user_update.email = email
    user_update.user_type = user_type

    try:
        db.session.commit()
        return jsonify({"message": "Profile updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {e}"}), 500


@app.route('/api/search_opportunities', methods=['GET'])
@login_required
def search_opportunities():
    keyword = request.args.get('keyword')
    location = request.args.get('location')

    query = Opportunity.query
    if keyword:
        query = query.filter(Opportunity.title.like(f'%{keyword}%') | Opportunity.description.like(f'%{keyword}%'))
    if location:
        query = query.filter(Opportunity.location.like(f'%{location}%'))

    opportunities = query.all()
    results = [{"title": opp.title, "description": opp.description, "location": opp.location} for opp in opportunities]

    return jsonify(results)


@app.route('/api/profile/apply', methods=['POST'])
@login_required
def apply():
    data = request.form
    resume = request.files.get('resume')
    why_apply = data.get('whyApply')
    additional_info = data.get('additionalInfo')

    # Process the resume upload if it exists
    if resume:
        resume_filename = secure_filename(resume.filename)
        resume.save(os.path.join(app.config['UPLOAD_FOLDER'], resume_filename))
        # You could save the filename to the user's profile in the database

    # Process the additional application information (e.g., save to the user's profile)
    user = current_user
    user.why_apply = why_apply
    user.additional_info = additional_info

    try:
        db.session.commit()
        return jsonify({"message": "Application successfully submitted!"}), 200
    except Exception as e:
        return jsonify({"error": f"There was an error submitting your application: {e}"}), 500


    
@app.route('/view_applications/<int:opportunity_id>', methods=['GET'])
@login_required
def view_application(opportunity_id):
    opportunity = Opportunity.query.get_or_404(opportunity_id)
    
    if opportunity.professional_id != current_user.id:
        flash("You are not authorized to view applications.", "danger")
        return redirect(url_for('index'))
    
    applications = Application.query.filter_by(opportunity_id=opportunity_id).all()
    students = [User.query.get(app.student_id) for app in applications]

    return render_template('application.html', applications=applications, opportunity=opportunity, students=students)





@app.route('/delete/<int:id>')
@login_required
def delete(id):
    opportunity_to_delete = Opportunity.query.get_or_404(id)
    if opportunity_to_delete.professional_id != current_user.id:
        flash("You are not authorized to delete this opportunity.", "danger")
        return redirect(url_for('index'))
    try:
        db.session.delete(opportunity_to_delete)
        db.session.commit()
        flash("Opportunity deleted successfully!", "success")
        return redirect('/')
    except Exception as e:
        flash(f"There was an error deleting the opportunity: {e}", "danger")
        return redirect('/')






@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("You have successfully logged out.", "info")
    return redirect(url_for('login'))

if __name__ == "__main__":
    app.run(debug=True)


