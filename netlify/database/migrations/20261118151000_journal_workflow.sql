CREATE TABLE avaye_work (
  post_id integer PRIMARY KEY REFERENCES posts(id),
  version integer NOT NULL,
  state text NOT NULL CHECK (state IN ('draft','review','rejected','published')),
  payload jsonb NOT NULL,
  note text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE avaye_topics (
  title text PRIMARY KEY CHECK (length(title) BETWEEN 1 AND 100)
);
INSERT INTO avaye_topics (title) VALUES ('فرهنگی'), ('آموزشی'), ('معارف دینی');
CREATE TABLE avaye_public_files (
  post_id integer PRIMARY KEY REFERENCES posts(id),
  attachment jsonb NOT NULL
);
CREATE TABLE avaye_uploads (
  key uuid PRIMARY KEY,
  post_id integer NOT NULL REFERENCES posts(id),
  bytes bytea NOT NULL CHECK (octet_length(bytes) BETWEEN 1 AND 2097152)
);
CREATE INDEX avaye_uploads_owner_post ON avaye_uploads(post_id);
CREATE TABLE avaye_create_requests (
  owner_id text NOT NULL,
  request_id uuid NOT NULL,
  post_id integer REFERENCES posts(id),
  PRIMARY KEY(owner_id,request_id)
);
