require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;
const REMINDER_MINUTES = parseInt(process.env.REMINDER_MINUTES || '15', 10);

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !RECIPIENT_EMAIL) {
  console.warn('SMTP credentials or RECIPIENT_EMAIL not fully configured. See .env.example');
}

let transporter;
async function createTransporter() {
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
  }

  // Fallback: create a test account (Ethereal) for development/testing
  const testAccount = await nodemailer.createTestAccount();
  console.log('Using Nodemailer test account. Messages will be available at preview URLs.');
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user: testAccount.user, pass: testAccount.pass }
  });
}

(async () => { transporter = await createTransporter(); })();

// Simple in-memory store of scheduled timers (not persisted)
const scheduled = new Map();

app.get('/', (req, res) => {
  res.send('To-Do Reminder Server running');
});

// POST /api/tasks { text, due }
app.post('/api/tasks', (req, res) => {
  const { text, due } = req.body;

  if (!text) return res.status(400).json({ error: 'Task text required' });

  if (!due) {
    // If no due time provided, send immediate notification
    sendReminderEmail(text, new Date())
      .then(() => res.json({ status: 'sent_immediate' }))
      .catch(err => res.status(500).json({ error: err.message }));
    return;
  }

  const dueDate = new Date(due);
  if (isNaN(dueDate)) return res.status(400).json({ error: 'Invalid due date' });

  const reminderTime = new Date(dueDate.getTime() - REMINDER_MINUTES * 60000);
  const delay = reminderTime.getTime() - Date.now();

  const id = Date.now() + Math.random().toString(36).slice(2, 8);

  if (delay <= 0) {
    // reminder time passed — send immediately
    sendReminderEmail(text, dueDate)
      .then(() => res.json({ status: 'sent_immediate' }))
      .catch(err => res.status(500).json({ error: err.message }));
    return;
  }

  const timer = setTimeout(() => {
    sendReminderEmail(text, dueDate)
      .catch(err => console.error('Failed to send reminder:', err.message));
    scheduled.delete(id);
  }, delay);

  scheduled.set(id, { text, due: dueDate.toISOString(), timer });

  res.json({ status: 'scheduled', id, sendAt: reminderTime.toISOString() });
});

async function sendReminderEmail(taskText, dueDate) {
  if (!transporter || !RECIPIENT_EMAIL) return Promise.reject(new Error('Email not configured'));

  const formattedDue = dueDate ? new Date(dueDate).toLocaleString() : 'soon';
  const mailOptions = {
    from: SMTP_USER || 'no-reply@example.com',
    to: RECIPIENT_EMAIL,
    subject: `Reminder: upcoming task — ${taskText}`,
    text: `Reminder: Your task "${taskText}" is due at ${formattedDue}. This is an automated reminder sent ${REMINDER_MINUTES} minutes before.`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // Log preview URL for test accounts (Ethereal)
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log('Preview URL:', preview);
    return info;
  } catch (err) {
    return Promise.reject(err);
  }
}

// end of file

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Reminder server listening on port ${PORT}`);
});
