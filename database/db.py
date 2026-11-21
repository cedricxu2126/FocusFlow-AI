
import sqlite3
from pathlib import Path

# Locate the database directory
DATABASE_DIR = Path(__file__).resolve().parent

# Location of the SQLite database file
DATABASE_PATH = DATABASE_DIR / "focusflow.db"


def get_db_connection():
    """Create and return a connection to the SQLite database."""

    connection = sqlite3.connect(DATABASE_PATH)

    # Allows database rows to be accessed by column name
    connection.row_factory = sqlite3.Row

    return connection


def initialize_database():
    """Create the database tables if they don't already exist."""

    schema_path = DATABASE_DIR / "schema.sql"

    # Read the SQL commands from schema.sql
    with open(schema_path, "r", encoding="utf-8") as schema_file:
        schema = schema_file.read()

    # Execute the SQL commands
    connection = get_db_connection()

    try:
        connection.executescript(schema)
        connection.commit()
    finally:
        connection.close()


if __name__ == "__main__":
    initialize_database()
    print("FocusFlow AI database initialized successfully!")
