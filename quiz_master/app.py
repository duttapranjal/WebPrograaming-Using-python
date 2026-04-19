from __future__ import annotations

import random
from dataclasses import dataclass

from flask import Flask, redirect, render_template, request, session, url_for


app = Flask(__name__)
app.secret_key = "quiz-master-secret-key"


@dataclass(frozen=True)
class Question:
    prompt: str
    options: tuple[str, ...]
    answer: str
    explanation: str


QUESTIONS: tuple[Question, ...] = (
    Question(
        prompt="Which HTML tag is used to create a hyperlink?",
        options=("<link>", "<a>", "<href>", "<url>"),
        answer="<a>",
        explanation="The <a> tag creates hyperlinks in HTML.",
    ),
    Question(
        prompt="What does CSS stand for?",
        options=(
            "Creative Style Sheets",
            "Cascading Style Sheets",
            "Computer Style System",
            "Color Style Syntax",
        ),
        answer="Cascading Style Sheets",
        explanation="CSS stands for Cascading Style Sheets.",
    ),
    Question(
        prompt="Which Flask object is typically used to create a web application?",
        options=("Application", "Flask", "Blueprint", "Route"),
        answer="Flask",
        explanation="A Flask instance is created with Flask(__name__).",
    ),
    Question(
        prompt="Which HTTP method is commonly used when submitting a form securely?",
        options=("GET", "POST", "PUT", "DELETE"),
        answer="POST",
        explanation="POST sends form data in the request body.",
    ),
    Question(
        prompt="What keyword is used in Python to define a function?",
        options=("func", "define", "def", "lambda"),
        answer="def",
        explanation="Python functions are declared with the def keyword.",
    ),
    Question(
        prompt="Which data type stores multiple values in an ordered, mutable way in Python?",
        options=("tuple", "list", "set", "dict"),
        answer="list",
        explanation="Lists are ordered and mutable.",
    ),
)

TIME_LIMIT_SECONDS = 300


@app.route("/")
def index():
    reset_quiz_state()
    return render_template("index.html", total_questions=len(QUESTIONS))


@app.route("/quiz", methods=["GET"])
def quiz():
    question_order = session.get("question_order")
    if not question_order:
        question_order = list(range(len(QUESTIONS)))
        random.shuffle(question_order)
        session["question_order"] = question_order

    ordered_questions = [QUESTIONS[index] for index in question_order]
    return render_template(
        "quiz.html",
        questions=ordered_questions,
        total_questions=len(ordered_questions),
        time_limit=TIME_LIMIT_SECONDS,
    )


@app.route("/submit", methods=["POST"])
def submit():
    question_order = session.get("question_order")
    if not question_order:
        return redirect(url_for("index"))

    ordered_questions = [QUESTIONS[index] for index in question_order]
    results = []
    score = 0

    for index, question in enumerate(ordered_questions):
        selected_answer = request.form.get(f"question-{index}")
        is_correct = selected_answer == question.answer

        if is_correct:
            score += 1

        results.append(
            {
                "number": index + 1,
                "question": question.prompt,
                "selected": selected_answer or "Not answered",
                "correct": question.answer,
                "is_correct": is_correct,
                "explanation": question.explanation,
            }
        )

    total_questions = len(ordered_questions)
    percentage = round((score / total_questions) * 100)
    feedback = build_feedback(percentage)

    reset_quiz_state()

    return render_template(
        "result.html",
        score=score,
        total_questions=total_questions,
        percentage=percentage,
        feedback=feedback,
        results=results,
    )


@app.route("/restart")
def restart():
    reset_quiz_state()
    return redirect(url_for("quiz"))


def build_feedback(percentage: int) -> str:
    if percentage == 100:
        return "Perfect score! You nailed every question."
    if percentage >= 80:
        return "Great work! You have a strong grasp of the basics."
    if percentage >= 60:
        return "Good effort! A little more practice will make it even better."
    return "Keep practicing — review the concepts and try again."


def reset_quiz_state() -> None:
    session.pop("question_order", None)


if __name__ == "__main__":
    app.run(debug=True)
