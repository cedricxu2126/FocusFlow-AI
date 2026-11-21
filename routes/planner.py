
from flask import Blueprint, render_template, jsonify
from database.db import get_db_connection
from datetime import date, datetime

planner_bp = Blueprint("planner", __name__)


# Display the AI Planner page
@planner_bp.route("/planner")
def planner_page():
    return render_template("planner.html")


# Analyze tasks and generate productivity recommendations
@planner_bp.route("/api/planner", methods=["GET"])
def generate_plan():

    connection = get_db_connection()

    try:
        tasks = connection.execute(
            """
            SELECT *
            FROM tasks
            WHERE status = 'Pending'
            """
        ).fetchall()

        today = date.today()
        recommendations = []

        estimated_workload = 0
        unestimated_tasks = 0

        for task in tasks:

            task = dict(task)

            # Base priority score
            priority_scores = {
                "High": 100,
                "Medium": 60,
                "Low": 30
            }

            score = priority_scores.get(task["priority"], 30)

            # Consider the task's due date
            due_date = None

            if task["due_date"]:
                try:
                    due_date = datetime.strptime(
                        task["due_date"], "%Y-%m-%d"
                    ).date()
                except ValueError:
                    due_date = None

            if due_date:
                days_remaining = (due_date - today).days

                if days_remaining < 0:
                    score += 100
                    task["due_status"] = "Overdue"

                elif days_remaining == 0:
                    score += 80
                    task["due_status"] = "Due today"

                elif days_remaining <= 2:
                    score += 50
                    task["due_status"] = "Due soon"

                elif days_remaining <= 7:
                    score += 25
                    task["due_status"] = "Due this week"

                else:
                    task["due_status"] = "Upcoming"

            else:
                task["due_status"] = "No due date"

            # Track estimated workload
            if task["estimated_minutes"]:
                estimated_workload += task["estimated_minutes"]
            else:
                unestimated_tasks += 1

            task["recommendation_score"] = score

            recommendations.append(task)

        # Highest recommendation score comes first
        recommendations.sort(
            key=lambda task: task["recommendation_score"],
            reverse=True
        )

        # Generate workload insights
        if estimated_workload == 0:
            workload_insight = (
                "Add estimated durations to your tasks "
                "to help calculate your workload."
            )

        elif estimated_workload <= 120:
            workload_insight = (
                "Your estimated workload is manageable. "
                "Focus on completing your highest-priority tasks."
            )

        elif estimated_workload <= 300:
            workload_insight = (
                "You have a moderate workload. "
                "Break your work into focused sessions."
            )

        else:
            workload_insight = (
                "You have a heavy workload. "
                "Prioritize urgent tasks and spread your work "
                "across multiple sessions."
            )

        # Generate break recommendations
        if estimated_workload >= 300:
            break_recommendation = (
                "Consider taking a 10-15 minute break after "
                "each focused work session."
            )

        elif estimated_workload >= 120:
            break_recommendation = (
                "Consider taking a 5-10 minute break "
                "between work sessions."
            )

        else:
            break_recommendation = (
                "Try taking a short break whenever you "
                "finish a task or feel your concentration fading."
            )

        return jsonify({
            "total_tasks": len(recommendations),
            "pending_tasks": len(recommendations),
            "estimated_workload": estimated_workload,
            "unestimated_tasks": unestimated_tasks,
            "recommendations": recommendations,
            "workload_insight": workload_insight,
            "break_recommendation": break_recommendation
        })

    finally:
        connection.close()
