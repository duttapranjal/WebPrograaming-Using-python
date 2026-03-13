# Dynamic To-Do List

A database-backed To-Do List application built with HTML, CSS, JavaScript, Node.js, Express, and SQLite.

## Project Structure

```text
dynamic_todo_list/
  frontend/
    index.html
    style.css
    script.js
  backend/
    server.js
    package.json
    db.sqlite   (auto-created after first run)
  REPORT.md
  README.md
```

## Features
- Add, edit, delete, and complete tasks
- Filter tasks by All / Active / Completed
- View Completed / Total counters
- Search tasks by keyword
- Sort tasks by date, title, or priority
- Export tasks to JSON
- Persistent storage with SQLite

## Backend API
- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `PATCH /tasks/:id/status`
- `DELETE /tasks/:id`

## How to Run

### 1. Install backend dependencies
Open a terminal in the `backend/` folder and run:

```bash
npm install
```

### 2. Start the backend server

```bash
npm start
```

The app will run at:

```text
http://localhost:4000
```

### 3. Open the application
Open the browser and visit:

```text
http://localhost:4000
```

## Validation Rules
- Task title cannot be empty
- Task title must be 50 characters or fewer
- Priority must be Low, Medium, or High

## Submission Checklist
- `frontend/` folder
- `backend/` folder
- `REPORT.md`
- Screenshots showing:
  - task added
  - task edited
  - task marked complete
  - task persisted after refresh

## Notes
- The SQLite database file `db.sqlite` is created automatically inside `backend/` after the server starts.
- If port `4000` is busy, stop the other process using that port and restart the server.
