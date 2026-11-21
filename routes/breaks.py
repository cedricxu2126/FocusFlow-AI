
from flask import Blueprint, render_template
from database.db import get_db_connection

breaks_bp = Blueprint("breaks", __name__)


@breaks_bp.route("/breaks")
def breaks_page():
    connection = get_db_connection()

    try:
        settings = connection.execute(
            "SELECT * FROM user_settings WHERE id = 1"
        ).fetchone()

        return render_template(
            "breaks.html",
            settings=settings
        )

    finally:
        connection.close()
