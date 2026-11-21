
from flask import Blueprint, request, jsonify, render_template
from database.db import get_db_connection

tasks_bp = Blueprint("tasks", __name__)
# Display the task management page
@tasks_bp.route("/tasks")
def tasks_page():
    return render_template("tasks.html")

# GET: Retrieve all tasks
@tasks_bp.route("/api/tasks", methods=["GET"])
def get_tasks():
    connection = get_db_connection()

    try:
        tasks = connection.execute(
            "SELECT * FROM tasks ORDER BY created_at DESC"
        ).fetchall()

        return jsonify([dict(task) for task in tasks])
    finally:
        connection.close()


# POST: Create a new task
@tasks_bp.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.get_json(silent=True) or {}

    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    due_date = data.get("due_date") or None
    priority = data.get("priority", "Medium")
    estimated_minutes = data.get("estimated_minutes")

    if not title:
        return jsonify({"error": "Task title is required."}), 400

    if priority not in ["Low", "Medium", "High"]:
        return jsonify({"error": "Invalid priority."}), 400

    if estimated_minutes is not None:
        try:
            estimated_minutes = int(estimated_minutes)
            if estimated_minutes <= 0:
                raise ValueError
        except (ValueError, TypeError):
            return jsonify({"error": "Estimated time must be a positive number."}), 400

    connection = get_db_connection()

    try:
        cursor = connection.execute(
            """
            INSERT INTO tasks
            (title, description, due_date, priority, estimated_minutes)
            VALUES (?, ?, ?, ?, ?)
            """,
            (title, description, due_date, priority, estimated_minutes)
        )

        connection.commit()

        return jsonify({
            "message": "Task created successfully.",
            "task_id": cursor.lastrowid
        }), 201
    finally:
        connection.close()


# PUT: Edit an existing task
@tasks_bp.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json(silent=True) or {}

    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    due_date = data.get("due_date") or None
    priority = data.get("priority", "Medium")
    estimated_minutes = data.get("estimated_minutes")

    if not title:
        return jsonify({"error": "Task title is required."}), 400

    if priority not in ["Low", "Medium", "High"]:
        return jsonify({"error": "Invalid priority."}), 400

    if estimated_minutes is not None:
        try:
            estimated_minutes = int(estimated_minutes)
            if estimated_minutes <= 0:
                raise ValueError
        except (ValueError, TypeError):
            return jsonify({"error": "Estimated time must be a positive number."}), 400

    connection = get_db_connection()

    try:
        cursor = connection.execute(
            """
            UPDATE tasks
            SET title = ?, description = ?, due_date = ?,
                priority = ?, estimated_minutes = ?
            WHERE id = ?
            """,
            (title, description, due_date, priority,
             estimated_minutes, task_id)
        )

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Task not found."}), 404

        return jsonify({"message": "Task updated successfully."})
    finally:
        connection.close()


# PATCH: Mark a task as completed
@tasks_bp.route("/api/tasks/<int:task_id>/complete", methods=["PATCH"])
def complete_task(task_id):
    connection = get_db_connection()

    try:
        cursor = connection.execute(
            """
            UPDATE tasks
            SET status = 'Completed'
            WHERE id = ?
            """,
            (task_id,)
        )

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Task not found."}), 404

        return jsonify({"message": "Task completed successfully."})
    finally:
        connection.close()


# DELETE: Remove a task
@tasks_bp.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    connection = get_db_connection()

    try:
        cursor = connection.execute(
            "DELETE FROM tasks WHERE id = ?",
            (task_id,)
        )

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Task not found."}), 404

        return jsonify({"message": "Task deleted successfully."})
    finally:
        connection.close()
