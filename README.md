# HealthConnect

HealthConnect is a full-stack web application that connects healthcare professionals with students looking for volunteer opportunities
and certifications. Built using Flask and React, it allows professionals to post opportunities and students to browse or search through 
listings.

Features:
🔐 User authentication (Signup/Login)
🧑‍⚕️ Professionals can create opportunities
🎓 Students can browse/search by title, location, or description
📧 Clickable email links to contact professionals directly
🎯 Role-based access control (students can't post)

Tech Stack:
Frontend: React, React Router, Axios, CSS
Backend: Python Flask, Flask-Login, SQLAlchemy, Flask-CORS, Flask-Bcrypt
Database: SQLite (for development)

Setup Instructions
Backend:
    cd backend
    python -m venv .venv
    source .venv/bin/activate  # or .venv\Scripts\activate on Windows
    pip install -r requirements.txt
    flask run

Frontend
cd frontend/my-app
npm install
npm start
Folder Structure:
    HealthConnect/
    ├── backend/
    │   ├── app.py
    │   └── ...
    ├── frontend/
    │   └── my-app/
    │       ├── src/
    │       └── public/
    └── README.md
Contact: 
    Built by Zayne Bournand
    📧 zaybournand@gmail.com
