
from flask import Blueprint, render_template, jsonify, request
from database.db import get_db_connection

focus_bp = Blueprint("focus", __name__)


@focus_bp.route("/focus")
def focus_page():
    connection = get_db_connection()

    try:
        settings = connection.execute(
            "SELECT * FROM user_settings WHERE id = 1"
        ).fetchone()

        return render_template(
            "focus.html",
            settings=settings
        )

    finally:
        connection.close()


@focus_bp.route("/api/focus/sessions", methods=["POST"])
def save_focus_session():
    data = request.get_json(silent=True) or {}
    duration = data.get("duration_minutes")

    if (
        isinstance(duration, bool)
        or not isinstance(duration, int)
        or duration < 1
        or duration > 180
    ):
        return jsonify({"error": "Invalid session duration."}), 400

    connection = get_db_connection()

    try:
        connection.execute(
            """
            INSERT INTO focus_sessions (duration_minutes)
            VALUES (?)
            """,
            (duration,)
        )
        connection.commit()

        return jsonify({"message": "Focus session saved."}), 201

    finally:
        connection.close()


@focus_bp.route("/api/focus/stats", methods=["GET"])
def get_focus_stats():
    connection = get_db_connection()

    try:
        stats = connection.execute(
            """
            SELECT
                COUNT(*) AS completed_sessions,
                COALESCE(SUM(duration_minutes), 0) AS total_minutes
            FROM focus_sessions
            WHERE date(completed_at, 'localtime') =
                  date('now', 'localtime')
            """
        ).fetchone()

        return jsonify({
            "completed_sessions": stats["completed_sessions"],
            "total_minutes": stats["total_minutes"]
        })

    finally:
        connection.close()
