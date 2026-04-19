from flask import Flask, flash, redirect, render_template, request, url_for

app = Flask(__name__)
app.secret_key = "simple-blog-secret-key"

blog_posts = [
    {
        "id": 1,
        "title": "Welcome to Simple Blog",
        "content": "This is a simple Flask blog application that supports create, read, update, and delete operations.",
    },
    {
        "id": 2,
        "title": "Experiment 5",
        "content": "This project demonstrates how to build a small blog web app using Flask and templates.",
    },
]


def get_post(post_id):
    return next((post for post in blog_posts if post["id"] == post_id), None)


@app.route("/")
def index():
    return render_template("index.html", posts=blog_posts)


@app.route("/create", methods=["GET", "POST"])
def create_post():
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        content = request.form.get("content", "").strip()

        if not title or not content:
            flash("Both title and content are required.", "error")
            return render_template("create.html")

        new_post = {
            "id": max((post["id"] for post in blog_posts), default=0) + 1,
            "title": title,
            "content": content,
        }
        blog_posts.append(new_post)
        flash("Blog post created successfully.", "success")
        return redirect(url_for("index"))

    return render_template("create.html")


@app.route("/edit/<int:post_id>", methods=["GET", "POST"])
def edit_post(post_id):
    post = get_post(post_id)
    if post is None:
        flash("Blog post not found.", "error")
        return redirect(url_for("index"))

    if request.method == "POST":
        title = request.form.get("title", "").strip()
        content = request.form.get("content", "").strip()

        if not title or not content:
            flash("Both title and content are required.", "error")
            return render_template("edit.html", post=post)

        post["title"] = title
        post["content"] = content
        flash("Blog post updated successfully.", "success")
        return redirect(url_for("index"))

    return render_template("edit.html", post=post)


@app.route("/delete/<int:post_id>", methods=["POST"])
def delete_post(post_id):
    post = get_post(post_id)
    if post is None:
        flash("Blog post not found.", "error")
    else:
        blog_posts.remove(post)
        flash("Blog post deleted successfully.", "success")
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True)
