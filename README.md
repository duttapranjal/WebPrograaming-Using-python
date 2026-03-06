To-Do Reminder Server

Setup

1. Copy `.env.example` to `.env` and fill SMTP credentials and `RECIPIENT_EMAIL`.
2. Install dependencies and start server:

```bash
cd "To-Do list/dynamic_todo_list/server"
npm install
npm start
```

Notes
- The server uses an in-memory scheduler (`setTimeout`) so scheduled reminders are lost if the server restarts.
- Configure `REMINDER_MINUTES` in `.env` to change how many minutes before the due time the reminder is sent (default 15).

The frontend will POST new tasks to `http://localhost:3000/api/tasks` with `{ text, due }`.
