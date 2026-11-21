
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    title TEXT NOT NULL,

    description TEXT,

    due_date TEXT,

    priority TEXT NOT NULL DEFAULT 'Medium'
        CHECK (priority IN ('Low', 'Medium', 'High')),

    status TEXT NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Pending', 'Completed')),

    estimated_minutes INTEGER
        CHECK (estimated_minutes IS NULL OR estimated_minutes > 0),

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS focus_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    duration_minutes INTEGER NOT NULL
        CHECK (duration_minutes > 0),
    completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS user_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    focus_duration INTEGER NOT NULL DEFAULT 25
        CHECK (focus_duration BETWEEN 1 AND 180),
    break_duration INTEGER NOT NULL DEFAULT 5
        CHECK (break_duration BETWEEN 1 AND 60)
);

INSERT OR IGNORE INTO user_settings (id)
VALUES (1);

