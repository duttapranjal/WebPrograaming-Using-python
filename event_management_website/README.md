<!--
Project: Event Management Website
Student Name:Pranjal Dutta
Roll Number: 241010051
Date: 2026-04-05
-->

# Event Management Website

A complete Flask-based Event Management portal built with HTML, CSS, JavaScript, and Python Flask.

## Features

- Landing page with project overview
- Dynamic events listing via Jinja2 templates
- Registration form with JavaScript + server-side validation
- Admin panel with Add, Edit, Delete event operations
- Flash messages for success/error states
- Live search, category filter, date filter, and RSVP counter

## Project Structure

```text
event_management_website/
├── app.py
├── requirements.txt
├── README.md
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── events.html
│   ├── register.html
│   └── admin.html
└── static/
    ├── css/style.css
    ├── js/script.js
    └── images/
```

## Setup and Run

1. Create and activate a virtual environment.
2. Install dependencies: `pip install -r requirements.txt`
3. Run the Flask app: `python app.py`
4. Open:
   - `http://127.0.0.1:5000/` for home page
   - `http://127.0.0.1:5000/admin/login` for admin login

## Admin Demo Credentials

- Username: `admin`
- Password: `admin123`
