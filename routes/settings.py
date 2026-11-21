
from flask import Blueprint, render_template, request, jsonify
from database.db import get_db_connection

settings_bp = Blueprint("settings", __name__)


@settings_bp.route("/settings")
def settings_page():
    connection = get_db_connection()

    try:
        settings = connection.execute(
            "SELECT * FROM user_settings WHERE id = 1"
        ).fetchone()

        return render_template(
            "settings.html",
            settings=settings
        )

    finally:
        connection.close()


@settings_bp.route("/api/settings", methods=["GET"])
def get_settings():
    connection = get_db_connection()

    try:
        settings = connection.execute(
            "SELECT * FROM user_settings WHERE id = 1"
        ).fetchone()

        return jsonify(dict(settings))

    finally:
        connection.close()


@settings_bp.route("/api/settings", methods=["PUT"])
def update_settings():
    data = request.get_json(silent=True) or {}

    focus_duration = data.get("focus_duration")
    break_duration = data.get("break_duration")

    if (
        isinstance(focus_duration, bool)
        or not isinstance(focus_duration, int)
        or not 1 <= focus_duration <= 180
    ):
        return jsonify({"error": "Focus duration must be between 1 and 180 minutes."}), 400

    if (
        isinstance(break_duration, bool)
        or not isinstance(break_duration, int)
        or not 1 <= break_duration <= 60
    ):
        return jsonify({"error": "Break duration must be between 1 and 60 minutes."}), 400

    connection = get_db_connection()

    try:
        connection.execute(
            """
            UPDATE user_settings
            SET focus_duration = ?, break_duration = ?
            WHERE id = 1
            """,
            (focus_duration, break_duration)
        )

        connection.commit()

        return jsonify({
            "message": "Settings saved successfully!",
            "focus_duration": focus_duration,
            "break_duration": break_duration
        })

    finally:
        connection.close()
