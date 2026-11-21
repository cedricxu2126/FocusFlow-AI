
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
