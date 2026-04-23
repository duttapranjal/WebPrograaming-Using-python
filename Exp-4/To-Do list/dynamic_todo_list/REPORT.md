# Dynamic To-Do List Report

## Project Overview
This project is a database-backed To-Do List web application built using HTML, CSS, JavaScript, Node.js, Express, and SQLite. It supports full CRUD operations, task filtering, input validation, and persistent task storage so tasks remain available after refresh or restart.

## Folder Structure
- `frontend/` — user interface files (`index.html`, `style.css`, `script.js`)
- `backend/` — API server (`server.js`, `package.json`, `db.sqlite` auto-created after first run)

## Database Schema
Table name: `tasks`

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| title | TEXT | NOT NULL |
| description | TEXT | Optional enhancement for task details |
| priority | TEXT | DEFAULT 'Medium' |
| isDone | INTEGER | DEFAULT 0 |
| createdAt | DATETIME | DEFAULT CURRENT_TIMESTAMP |

## REST API Endpoints
- `GET /tasks` — returns all tasks
- `POST /tasks` — creates a new task using `{ title, description, priority }`
- `PUT /tasks/:id` — updates task title, description, and priority
- `PATCH /tasks/:id/status` — updates completion status using `{ isDone }`
- `DELETE /tasks/:id` — deletes a task

## Frontend Features
- Add task with title, optional description, and priority
- Edit task details
- Delete task
- Mark task as completed
- Filter by All / Active / Completed
- Counter for Completed / Total and Active tasks
- Responsive design for desktop and mobile

## Bonus Features Implemented
1. Search tasks by keyword
2. Sort tasks by created date, title, or priority
3. Export tasks to JSON

## Validation Rules
- Empty task titles are not allowed
- Task titles are limited to 50 characters
- Priority is restricted to Low, Medium, or High

## Challenges Faced
- Keeping frontend state synchronized with server responses after each CRUD action
- Designing sorting and filtering without breaking the completed/total counters
- Supporting responsive styling while keeping action controls clear on smaller screens

## How to Run
1. Open a terminal in `backend/`
2. Run `npm install`
3. Start the server with `npm start`
4. Open `http://localhost:4000`

## Screenshot Checklist
Take screenshots of:
- Task added
- Task edited
- Task marked complete
- Task still visible after refresh
