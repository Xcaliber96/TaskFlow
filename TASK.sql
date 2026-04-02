CREATE EXTENSION IF NOT EXISTS ltree;

CREATE TABLE Task(
	id SERIAL  PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT,
	status TEXT NOT NULL DEFAULT 'todo',
	path ltree,
	created_at TIMESTAMP WITH TIME ZONE	DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE outbox_event(
	id SERIAL Primary key,
	event_type text not null,
	payload JSONB not null,
	processed BOOLEAN default FALSE,
	created_at TIMESTAMP WITH TIME ZONE	DEFAULT CURRENT_TIMESTAMP
);