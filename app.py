
from flask import Flask, render_template
from dotenv import load_dotenv


from database.db import initialize_database
from database.db import get_db_connection
from routes.tasks import tasks_bp
from routes.planner import planner_bp

load_dotenv()

app = Flask(__name__)

# Register the task management routes
app.register_blueprint(tasks_bp)
app.register_blueprint(planner_bp)


@app.route("/")
def dashboard():
    connection = get_db_connection()

    try:
        total_tasks = connection.execute(
            "SELECT COUNT(*) FROM tasks"
        ).fetchone()[0]

        completed_tasks = connection.execute(
            "SELECT COUNT(*) FROM tasks WHERE status = 'Completed'"
        ).fetchone()[0]

        pending_tasks = connection.execute(
            "SELECT COUNT(*) FROM tasks WHERE status = 'Pending'"
        ).fetchone()[0]

        tasks = connection.execute(
            """
            SELECT *
            FROM tasks
            ORDER BY
                CASE priority
                    WHEN 'High' THEN 1
                    WHEN 'Medium' THEN 2
                    WHEN 'Low' THEN 3
                END,
                created_at DESC
            LIMIT 5
            """
        ).fetchall()

        return render_template(
            "index.html",
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            pending_tasks=pending_tasks,
            tasks=tasks
        )

    finally:
        connection.close()


# Initialize the database when the application starts
initialize_database()


if __name__ == "__main__":
    app.run(debug=True)
