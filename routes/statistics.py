
from flask import Blueprint, render_template
from database.db import get_db_connection

statistics_bp = Blueprint("statistics", __name__)


@statistics_bp.route("/statistics")
def statistics_page():
    connection = get_db_connection()

    try:
        # Task statistics
        task_stats = connection.execute(
            """
            SELECT
                COUNT(*) AS total_tasks,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END)
                    AS completed_tasks,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END)
                    AS pending_tasks
            FROM tasks
            """
        ).fetchone()

        # Focus statistics for today
        focus_stats = connection.execute(
            """
            SELECT
                COUNT(*) AS completed_sessions,
                COALESCE(SUM(duration_minutes), 0) AS total_minutes
            FROM focus_sessions
            WHERE date(completed_at, 'localtime') =
                  date('now', 'localtime')
            """
        ).fetchone()

        total_tasks = task_stats["total_tasks"]
        completed_tasks = task_stats["completed_tasks"] or 0

        completion_rate = (
            round((completed_tasks / total_tasks) * 100)
            if total_tasks > 0 else 0
        )

        return render_template(
            "statistics.html",
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            pending_tasks=task_stats["pending_tasks"] or 0,
            completed_sessions=focus_stats["completed_sessions"],
            total_minutes=focus_stats["total_minutes"],
            completion_rate=completion_rate
        )

    finally:
        connection.close()
