# Flask ToDo App — Assignment 4

A full-featured ToDo web application built with **Flask** and **SQLAlchemy**.

---

## Features

- ✅ Add tasks with title, description, and priority
- ✏️ Edit existing tasks
- 🗑️ Delete individual tasks
- ✔️ Mark tasks complete/incomplete (toggle)
- 🔴🟡🟢 Priority levels: High / Medium / Low
- 🔍 Filter tasks: All / Active / Completed
- 📊 Live stats counter (total, active, done)
- 🧹 Clear all completed tasks at once
- 💾 SQLite database for persistence

---

## Project Structure

```
todo_flask_app/
│
├── app.py                   # Main Flask application & routes
├── requirements.txt         # Python dependencies
├── README.md
│
├── templates/
│   ├── base.html            # Base layout template
│   ├── index.html           # Home page (todo list)
│   └── edit.html            # Edit task page
│
└── static/
    ├── css/
    │   └── style.css        # Application styles
    └── js/
        └── main.js          # Frontend JavaScript
```

---

## Setup & Run

### 1. Create a virtual environment (recommended)
```bash
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the app
```bash
python app.py
```

### 4. Open in browser
Visit: [http://127.0.0.1:5000](http://127.0.0.1:5000)

> The SQLite database (`todos.db`) is automatically created on first run.

---

## Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Home — list all todos |
| `/add` | POST | Add a new todo |
| `/toggle/<id>` | GET | Toggle complete/incomplete |
| `/edit/<id>` | GET, POST | Edit a todo |
| `/delete/<id>` | GET | Delete a todo |
| `/clear_completed` | GET | Delete all completed todos |

---

## Tech Stack

- **Backend**: Python, Flask, Flask-SQLAlchemy
- **Database**: SQLite
- **Frontend**: HTML5, CSS3, Vanilla JS
- **Icons**: Font Awesome 6

---

## Database Model

```python
class Todo(db.Model):
    id          # Integer, Primary Key
    title       # String(200), Required
    description # Text, Optional
    completed   # Boolean, default False
    priority    # String (low/medium/high), default 'medium'
    created_at  # DateTime, auto-set
```
