
from flask import Flask, render_template

from database.db import initialize_database
from routes.tasks import tasks_bp

app = Flask(__name__)

# Register the task management routes
app.register_blueprint(tasks_bp)


@app.route("/")
def dashboard():
    return render_template("index.html")


# Initialize the database when the application starts
initialize_database()


if __name__ == "__main__":
    app.run(debug=True)
