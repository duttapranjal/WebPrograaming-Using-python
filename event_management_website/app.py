"""
Project: Event Management Website
Student Name:Pranjal Dutta
Roll Number: 241010051
Date: 2026-04-05
"""

from __future__ import annotations

from functools import wraps
from typing import Any

from flask import Flask, flash, redirect, render_template, request, session, url_for

app = Flask(__name__)
app.config["SECRET_KEY"] = "event-management-secret-key"
app.config["DEBUG"] = True


# In-memory event store for learning/demo use.
events: list[dict[str, Any]] = [
    {
        "id": 1,
        "name": "Tech Innovators Meetup",
        "date": "2026-04-20",
        "time": "10:00 AM",
        "venue": "City Convention Hall",
        "category": "Technology",
        "description": "A networking event for developers, startups, and product teams.",
        "image_url": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
        "rsvp_count": 12,
    },
    {
        "id": 2,
        "name": "Art and Culture Fest",
        "date": "2026-04-28",
        "time": "05:30 PM",
        "venue": "Riverfront Art Arena",
        "category": "Culture",
        "description": "Celebrate music, painting, dance, and local creative talent.",
        "image_url": "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
        "rsvp_count": 21,
    },
    {
        "id": 3,
        "name": "Startup Pitch Day",
        "date": "2026-05-02",
        "time": "02:00 PM",
        "venue": "Innovation Hub Auditorium",
        "category": "Business",
        "description": "Early-stage founders pitch ideas to mentors and investors.",
        "image_url": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
        "rsvp_count": 17,
    },
    {
        "id": 4,
        "name": "Community Health Camp",
        "date": "2026-05-08",
        "time": "09:00 AM",
        "venue": "Green Park Grounds",
        "category": "Community",
        "description": "Free health checkups and awareness sessions for families.",
        "image_url": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
        "rsvp_count": 9,
    },
]

registrations: list[dict[str, Any]] = []


def admin_required(func):
    """Protect admin routes using a simple session flag."""

    @wraps(func)
    def wrapper(*args, **kwargs):
        if not session.get("is_admin"):
            flash("Please login as admin to continue.", "error")
            return redirect(url_for("admin_login"))
        return func(*args, **kwargs)

    return wrapper


def get_next_event_id() -> int:
    if not events:
        return 1
    return max(event["id"] for event in events) + 1


def find_event(event_id: int) -> dict[str, Any] | None:
    return next((event for event in events if event["id"] == event_id), None)


@app.route("/")
def index():
    return render_template("index.html", page_title="Welcome")


@app.route("/events")
def event_list():
    categories = sorted({event["category"] for event in events})
    return render_template(
        "events.html",
        page_title="Browse Events",
        events=events,
        categories=categories,
    )


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        full_name = request.form.get("full_name", "").strip()
        email = request.form.get("email", "").strip()
        phone = request.form.get("phone", "").strip()
        selected_event_id = request.form.get("event_id", "").strip()
        tickets_raw = request.form.get("tickets", "1").strip()

        if not all([full_name, email, phone, selected_event_id, tickets_raw]):
            flash("Please fill in all required fields.", "error")
            return redirect(url_for("register"))

        if "@" not in email or "." not in email:
            flash("Please provide a valid email address.", "error")
            return redirect(url_for("register"))

        if not phone.isdigit() or len(phone) < 10:
            flash("Phone number should contain at least 10 digits.", "error")
            return redirect(url_for("register"))

        try:
            event_id = int(selected_event_id)
            tickets = int(tickets_raw)
            if tickets <= 0:
                raise ValueError
        except ValueError:
            flash("Select a valid event and ticket count.", "error")
            return redirect(url_for("register"))

        event = find_event(event_id)
        if event is None:
            flash("Selected event does not exist.", "error")
            return redirect(url_for("register"))

        registrations.append(
            {
                "full_name": full_name,
                "email": email,
                "phone": phone,
                "event_id": event_id,
                "tickets": tickets,
            }
        )
        event["rsvp_count"] += tickets
        flash("Registration successful. Your seat is confirmed.", "success")
        return redirect(url_for("event_list"))

    return render_template("register.html", page_title="Register", events=events)


@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "").strip()

        if username == "admin" and password == "admin123":
            session["is_admin"] = True
            flash("Admin login successful.", "success")
            return redirect(url_for("admin_panel"))

        flash("Invalid admin credentials.", "error")
        return redirect(url_for("admin_login"))

    return render_template("admin.html", page_title="Admin Login", mode="login", events=events)


@app.route("/admin/logout")
@admin_required
def admin_logout():
    session.pop("is_admin", None)
    flash("Logged out from admin panel.", "success")
    return redirect(url_for("index"))


@app.route("/admin")
@admin_required
def admin_panel():
    return render_template("admin.html", page_title="Admin Panel", mode="panel", events=events)


@app.route("/admin/add", methods=["POST"])
@admin_required
def admin_add_event():
    name = request.form.get("name", "").strip()
    date = request.form.get("date", "").strip()
    time = request.form.get("time", "").strip()
    venue = request.form.get("venue", "").strip()
    category = request.form.get("category", "").strip()
    description = request.form.get("description", "").strip()
    image_url = request.form.get("image_url", "").strip()

    if not all([name, date, time, venue, category, description, image_url]):
        flash("All event fields are required.", "error")
        return redirect(url_for("admin_panel"))

    events.append(
        {
            "id": get_next_event_id(),
            "name": name,
            "date": date,
            "time": time,
            "venue": venue,
            "category": category,
            "description": description,
            "image_url": image_url,
            "rsvp_count": 0,
        }
    )
    flash("Event added successfully.", "success")
    return redirect(url_for("admin_panel"))


@app.route("/admin/edit/<int:event_id>", methods=["GET", "POST"])
@admin_required
def admin_edit_event(event_id: int):
    event = find_event(event_id)
    if event is None:
        flash("Event not found.", "error")
        return redirect(url_for("admin_panel"))

    if request.method == "POST":
        event["name"] = request.form.get("name", event["name"]).strip()
        event["date"] = request.form.get("date", event["date"]).strip()
        event["time"] = request.form.get("time", event["time"]).strip()
        event["venue"] = request.form.get("venue", event["venue"]).strip()
        event["category"] = request.form.get("category", event["category"]).strip()
        event["description"] = request.form.get("description", event["description"]).strip()
        event["image_url"] = request.form.get("image_url", event["image_url"]).strip()
        flash("Event updated successfully.", "success")
        return redirect(url_for("admin_panel"))

    return render_template(
        "admin.html",
        page_title="Edit Event",
        mode="edit",
        events=events,
        edit_event=event,
    )


@app.route("/admin/delete/<int:event_id>", methods=["POST"])
@admin_required
def admin_delete_event(event_id: int):
    event = find_event(event_id)
    if event is None:
        flash("Event not found.", "error")
        return redirect(url_for("admin_panel"))

    events.remove(event)
    flash("Event deleted successfully.", "success")
    return redirect(url_for("admin_panel"))


if __name__ == "__main__":
    app.run(debug=True)
