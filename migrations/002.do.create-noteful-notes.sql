CREATE TABLE notes(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    note_name TEXT NOT NULL,
    content TEXT,
    date_modified TIMESTAMP DEFAULT NOW() NOT NULL,
    folder_id INTEGER REFERENCES folders(id)
);